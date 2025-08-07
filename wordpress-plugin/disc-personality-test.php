<?php
/**
 * Plugin Name: DISC人格測驗
 * Plugin URI: https://your-website.com/disc-test
 * Description: 基於DISC人格理論的專業測驗插件，提供完整的測驗功能和結果分析
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: disc-test
 */

// 防止直接訪問
if (!defined('ABSPATH')) {
    exit;
}

// 定義插件常量
define('DISC_PLUGIN_URL', plugin_dir_url(__FILE__));
define('DISC_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('DISC_PLUGIN_VERSION', '1.0.0');

// 激活鉤子
register_activation_hook(__FILE__, 'disc_plugin_activate');
function disc_plugin_activate() {
    // 創建數據表
    disc_create_tables();
    // 設置默認選項
    disc_set_default_options();
    // 刷新重寫規則
    flush_rewrite_rules();
}

// 停用鉤子
register_deactivation_hook(__FILE__, 'disc_plugin_deactivate');
function disc_plugin_deactivate() {
    // 清理重寫規則
    flush_rewrite_rules();
}

// 創建數據表
function disc_create_tables() {
    global $wpdb;
    
    $charset_collate = $wpdb->get_charset_collate();
    
    // 測驗結果表
    $table_results = $wpdb->prefix . 'disc_results';
    $sql_results = "CREATE TABLE $table_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        session_id VARCHAR(255),
        d_score INT DEFAULT 0,
        i_score INT DEFAULT 0,
        s_score INT DEFAULT 0,
        c_score INT DEFAULT 0,
        dominant_type VARCHAR(10),
        result_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) $charset_collate;";
    
    // 管理員設置表
    $table_settings = $wpdb->prefix . 'disc_settings';
    $sql_settings = "CREATE TABLE $table_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql_results);
    dbDelta($sql_settings);
}

// 設置默認選項
function disc_set_default_options() {
    global $wpdb;
    $table_settings = $wpdb->prefix . 'disc_settings';
    
    $default_settings = array(
        'admin_password' => 'admin123',
        'test_title' => 'DISC人格測驗',
        'test_description' => '了解您的DISC人格類型',
        'questions_count' => 24
    );
    
    foreach ($default_settings as $key => $value) {
        $wpdb->replace(
            $table_settings,
            array(
                'setting_key' => $key,
                'setting_value' => $value
            ),
            array('%s', '%s')
        );
    }
}

// 加載核心類
require_once DISC_PLUGIN_PATH . 'includes/class-disc-test.php';
require_once DISC_PLUGIN_PATH . 'includes/class-disc-results.php';
require_once DISC_PLUGIN_PATH . 'includes/class-disc-admin.php';
require_once DISC_PLUGIN_PATH . 'includes/class-disc-shortcodes.php';

// 初始化插件
function disc_init() {
    new DISC_Test();
    new DISC_Results();
    new DISC_Admin();
    new DISC_Shortcodes();
}
add_action('init', 'disc_init');

// 加載樣式和腳本
function disc_enqueue_scripts() {
    wp_enqueue_style('disc-test-style', DISC_PLUGIN_URL . 'assets/css/disc-test.css', array(), DISC_PLUGIN_VERSION);
    wp_enqueue_script('disc-test-script', DISC_PLUGIN_URL . 'assets/js/disc-test.js', array('jquery'), DISC_PLUGIN_VERSION, true);
    
    // 本地化腳本
    wp_localize_script('disc-test-script', 'disc_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('disc_test_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'disc_enqueue_scripts');

// AJAX處理函數
add_action('wp_ajax_disc_get_questions', 'disc_get_questions');
add_action('wp_ajax_nopriv_disc_get_questions', 'disc_get_questions');

function disc_get_questions() {
    check_ajax_referer('disc_test_nonce', 'nonce');
    
    $questions = array(
        array(
            'id' => 1,
            'question' => '在團隊中，我傾向於：',
            'options' => array(
                '直接領導並做出決策',
                '激勵他人並建立關係',
                '支持團隊並保持和諧',
                '分析問題並確保品質'
            )
        ),
        array(
            'id' => 2,
            'question' => '面對挑戰時，我通常：',
            'options' => array(
                '立即採取行動解決問題',
                '尋求他人的支持和建議',
                '仔細分析情況再決定',
                '保持冷靜並觀察局勢'
            )
        ),
        array(
            'id' => 3,
            'question' => '在工作中，我最重視：',
            'options' => array(
                '達成目標和結果',
                '與同事建立良好關係',
                '工作的穩定性和一致性',
                '工作的準確性和品質'
            )
        ),
        array(
            'id' => 4,
            'question' => '與他人溝通時，我喜歡：',
            'options' => array(
                '直接表達想法和意見',
                '分享故事和個人經驗',
                '傾聽並理解他人觀點',
                '提供詳細的事實和數據'
            )
        ),
        array(
            'id' => 5,
            'question' => '做決策時，我通常：',
            'options' => array(
                '快速做出決定並執行',
                '考慮對他人的影響',
                '收集更多信息再決定',
                '仔細分析所有選項'
            )
        ),
        array(
            'id' => 6,
            'question' => '在壓力下，我傾向於：',
            'options' => array(
                '更加積極主動',
                '尋求他人的支持',
                '保持耐心和冷靜',
                '更加謹慎和仔細'
            )
        ),
        array(
            'id' => 7,
            'question' => '我認為成功最重要的是：',
            'options' => array(
                '達成目標和獲得認可',
                '建立良好的人際關係',
                '保持內心的平靜和滿足',
                '工作的準確性和專業性'
            )
        ),
        array(
            'id' => 8,
            'question' => '在會議中，我通常：',
            'options' => array(
                '主導討論並提出建議',
                '活躍氣氛並鼓勵參與',
                '安靜觀察並適時發言',
                '提供詳細的分析和數據'
            )
        ),
        array(
            'id' => 9,
            'question' => '面對變化時，我：',
            'options' => array(
                '積極擁抱並推動變化',
                '樂觀看待並適應變化',
                '需要時間來適應變化',
                '仔細評估變化的影響'
            )
        ),
        array(
            'id' => 10,
            'question' => '我認為理想的領導者應該：',
            'options' => array(
                '果斷決策並推動執行',
                '激勵團隊並建立願景',
                '支持團隊並保持穩定',
                '提供指導並確保品質'
            )
        ),
        array(
            'id' => 11,
            'question' => '在學習新技能時，我：',
            'options' => array(
                '立即實踐並快速掌握',
                '與他人分享學習過程',
                '需要時間來消化理解',
                '仔細研究並深入分析'
            )
        ),
        array(
            'id' => 12,
            'question' => '我認為衝突應該：',
            'options' => array(
                '直接面對並快速解決',
                '通過溝通來化解',
                '避免並保持和諧',
                '理性分析並找到最佳方案'
            )
        ),
        array(
            'id' => 13,
            'question' => '在團隊合作中，我喜歡：',
            'options' => array(
                '擔任領導角色',
                '促進團隊和諧',
                '支持團隊成員',
                '提供專業建議'
            )
        ),
        array(
            'id' => 14,
            'question' => '我認為時間管理最重要的是：',
            'options' => array(
                '高效完成任務',
                '平衡工作和生活',
                '保持穩定的節奏',
                '合理安排和規劃'
            )
        ),
        array(
            'id' => 15,
            'question' => '面對批評時，我：',
            'options' => array(
                '直接回應並改進',
                '虛心接受並感謝',
                '需要時間來消化',
                '仔細分析批評的合理性'
            )
        ),
        array(
            'id' => 16,
            'question' => '我認為創新最重要的是：',
            'options' => array(
                '快速實現想法',
                '激發團隊創意',
                '穩步推進改進',
                '深入研究和分析'
            )
        ),
        array(
            'id' => 17,
            'question' => '在社交場合中，我：',
            'options' => array(
                '主動與人交流',
                '活躍氣氛並帶動話題',
                '安靜觀察並適時參與',
                '保持禮貌和專業'
            )
        ),
        array(
            'id' => 18,
            'question' => '我認為信任的基礎是：',
            'options' => array(
                '能力和結果',
                '真誠和關懷',
                '穩定和可靠',
                '專業和準確'
            )
        ),
        array(
            'id' => 19,
            'question' => '面對失敗時，我：',
            'options' => array(
                '立即分析原因並改進',
                '尋求他人的安慰和支持',
                '需要時間來恢復信心',
                '仔細分析失敗的原因'
            )
        ),
        array(
            'id' => 20,
            'question' => '我認為工作的意義在於：',
            'options' => array(
                '達成目標和獲得成就',
                '幫助他人和建立關係',
                '保持穩定和提供服務',
                '追求卓越和專業成長'
            )
        ),
        array(
            'id' => 21,
            'question' => '在解決問題時，我通常：',
            'options' => array(
                '快速找到解決方案',
                '尋求他人的建議',
                '仔細考慮各種可能',
                '深入分析問題根源'
            )
        ),
        array(
            'id' => 22,
            'question' => '我認為團隊合作最重要的是：',
            'options' => array(
                '達成共同目標',
                '建立良好關係',
                '保持團隊和諧',
                '確保工作品質'
            )
        ),
        array(
            'id' => 23,
            'question' => '面對不確定性時，我：',
            'options' => array(
                '積極探索並嘗試',
                '樂觀面對並適應',
                '保持謹慎和耐心',
                '收集更多信息'
            )
        ),
        array(
            'id' => 24,
            'question' => '我認為個人成長最重要的是：',
            'options' => array(
                '不斷挑戰和突破',
                '與他人學習和交流',
                '保持內心的平靜',
                '深入學習和思考'
            )
        )
    );
    
    wp_send_json_success($questions);
}

// 提交測驗結果
add_action('wp_ajax_disc_submit_test', 'disc_submit_test');
add_action('wp_ajax_nopriv_disc_submit_test', 'disc_submit_test');

function disc_submit_test() {
    check_ajax_referer('disc_test_nonce', 'nonce');
    
    $answers = isset($_POST['answers']) ? json_decode(stripslashes($_POST['answers']), true) : array();
    
    if (empty($answers) || count($answers) != 24) {
        wp_send_json_error('測驗答案不完整');
    }
    
    // 計算DISC分數
    $d_score = 0;
    $i_score = 0;
    $s_score = 0;
    $c_score = 0;
    
    // 根據答案計算分數（這裡需要根據實際的DISC評分規則調整）
    foreach ($answers as $question_index => $answer) {
        $question_id = $question_index + 1;
        
        // 簡化的評分規則，實際應用中需要更複雜的算法
        switch ($answer) {
            case 0: // D型
                $d_score += 1;
                break;
            case 1: // I型
                $i_score += 1;
                break;
            case 2: // S型
                $s_score += 1;
                break;
            case 3: // C型
                $c_score += 1;
                break;
        }
    }
    
    // 確定主導類型
    $scores = array('D' => $d_score, 'I' => $i_score, 'S' => $s_score, 'C' => $c_score);
    $dominant_type = array_keys($scores, max($scores))[0];
    
    // 保存結果到數據庫
    global $wpdb;
    $table_results = $wpdb->prefix . 'disc_results';
    
    $result_data = array(
        'user_id' => get_current_user_id(),
        'session_id' => session_id(),
        'd_score' => $d_score,
        'i_score' => $i_score,
        's_score' => $s_score,
        'c_score' => $c_score,
        'dominant_type' => $dominant_type,
        'result_data' => json_encode($answers)
    );
    
    $wpdb->insert($table_results, $result_data);
    $result_id = $wpdb->insert_id;
    
    // 設置完成標記
    setcookie('disc_completed', $result_id, time() + (86400 * 30), '/');
    
    wp_send_json_success(array(
        'result_id' => $result_id,
        'redirect_url' => add_query_arg('result_id', $result_id, get_permalink())
    ));
}

// 添加管理菜單
function disc_admin_menu() {
    add_menu_page(
        'DISC測驗管理',
        'DISC測驗',
        'manage_options',
        'disc-test-admin',
        'disc_admin_page',
        'dashicons-chart-pie',
        30
    );
}
add_action('admin_menu', 'disc_admin_menu');

// 管理頁面
function disc_admin_page() {
    global $wpdb;
    $table_results = $wpdb->prefix . 'disc_results';
    
    // 獲取統計數據
    $total_results = $wpdb->get_var("SELECT COUNT(*) FROM $table_results");
    $d_count = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'D'");
    $i_count = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'I'");
    $s_count = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'S'");
    $c_count = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'C'");
    
    ?>
    <div class="wrap">
        <h1>DISC測驗管理</h1>
        
        <div class="disc-admin-stats">
            <h2>統計概覽</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>總測驗次數</h3>
                    <p><?php echo $total_results; ?></p>
                </div>
                <div class="stat-card">
                    <h3>D型 (支配型)</h3>
                    <p><?php echo $d_count; ?> (<?php echo $total_results > 0 ? round(($d_count / $total_results) * 100, 1) : 0; ?>%)</p>
                </div>
                <div class="stat-card">
                    <h3>I型 (影響型)</h3>
                    <p><?php echo $i_count; ?> (<?php echo $total_results > 0 ? round(($i_count / $total_results) * 100, 1) : 0; ?>%)</p>
                </div>
                <div class="stat-card">
                    <h3>S型 (穩健型)</h3>
                    <p><?php echo $s_count; ?> (<?php echo $total_results > 0 ? round(($s_count / $total_results) * 100, 1) : 0; ?>%)</p>
                </div>
                <div class="stat-card">
                    <h3>C型 (謹慎型)</h3>
                    <p><?php echo $c_count; ?> (<?php echo $total_results > 0 ? round(($c_count / $total_results) * 100, 1) : 0; ?>%)</p>
                </div>
            </div>
        </div>
        
        <div class="disc-admin-results">
            <h2>最近測驗結果</h2>
            <?php
            $recent_results = $wpdb->get_results("SELECT * FROM $table_results ORDER BY created_at DESC LIMIT 10");
            if ($recent_results): ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>用戶</th>
                        <th>主導類型</th>
                        <th>D分數</th>
                        <th>I分數</th>
                        <th>S分數</th>
                        <th>C分數</th>
                        <th>完成時間</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recent_results as $result): ?>
                    <tr>
                        <td><?php echo $result->id; ?></td>
                        <td><?php echo $result->user_id ? get_userdata($result->user_id)->display_name : '訪客'; ?></td>
                        <td><?php echo $result->dominant_type; ?></td>
                        <td><?php echo $result->d_score; ?></td>
                        <td><?php echo $result->i_score; ?></td>
                        <td><?php echo $result->s_score; ?></td>
                        <td><?php echo $result->c_score; ?></td>
                        <td><?php echo date('Y-m-d H:i:s', strtotime($result->created_at)); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php else: ?>
            <p>暫無測驗結果</p>
            <?php endif; ?>
        </div>
    </div>
    
    <style>
    .disc-admin-stats {
        margin: 20px 0;
    }
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 20px 0;
    }
    .stat-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        text-align: center;
    }
    .stat-card h3 {
        margin: 0 0 10px 0;
        color: #333;
    }
    .stat-card p {
        font-size: 24px;
        font-weight: bold;
        margin: 0;
        color: #0073aa;
    }
    </style>
    <?php
}
