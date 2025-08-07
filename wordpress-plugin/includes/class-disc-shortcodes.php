<?php
/**
 * DISC測驗短代碼處理類
 */

class DISC_Shortcodes {
    
    public function __construct() {
        add_shortcode('disc_test', array($this, 'render_test'));
        add_shortcode('disc_results', array($this, 'render_results'));
        add_shortcode('disc_intro', array($this, 'render_intro'));
    }
    
    /**
     * 渲染測驗界面
     */
    public function render_test($atts) {
        // 檢查用戶是否已完成測驗
        if (isset($_COOKIE['disc_completed'])) {
            return $this->render_completed_message();
        }
        
        $atts = shortcode_atts(array(
            'title' => 'DISC人格測驗',
            'description' => '了解您的DISC人格類型',
            'show_progress' => 'true'
        ), $atts);
        
        ob_start();
        ?>
        <div class="disc-shortcode">
            <div class="disc-test-container">
                <div class="disc-test-header">
                    <h1><?php echo esc_html($atts['title']); ?></h1>
                    <p><?php echo esc_html($atts['description']); ?></p>
                </div>
                
                <?php if ($atts['show_progress'] === 'true'): ?>
                <div class="test-progress">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
                <?php endif; ?>
                
                <div class="question-container">
                    <div class="loading">
                        <div class="spinner"></div>
                        <p style="margin-top: 20px; text-align: center;">正在加載測驗...</p>
                    </div>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * 渲染測驗結果
     */
    public function render_results($atts) {
        $result_id = isset($_GET['result_id']) ? intval($_GET['result_id']) : 0;
        
        if (!$result_id) {
            return '<div class="disc-shortcode"><p>未找到測驗結果</p></div>';
        }
        
        $result = $this->get_result($result_id);
        if (!$result) {
            return '<div class="disc-shortcode"><p>測驗結果不存在</p></div>';
        }
        
        $atts = shortcode_atts(array(
            'show_scores' => 'true',
            'show_description' => 'true'
        ), $atts);
        
        ob_start();
        ?>
        <div class="disc-shortcode">
            <div class="results-container">
                <div class="results-header">
                    <h2>您的DISC測驗結果</h2>
                    <p>測驗完成時間：<?php echo date('Y-m-d H:i:s', strtotime($result->created_at)); ?></p>
                </div>
                
                <div class="dominant-type">
                    <h3>您的主導類型：<?php echo $this->get_type_name($result->dominant_type); ?></h3>
                    <?php if ($atts['show_description'] === 'true'): ?>
                    <p><?php echo $this->get_type_description($result->dominant_type); ?></p>
                    <?php endif; ?>
                </div>
                
                <?php if ($atts['show_scores'] === 'true'): ?>
                <div class="disc-scores">
                    <div class="score-card d-type">
                        <h3>D型 (支配型)</h3>
                        <div class="score-value"><?php echo $result->d_score; ?></div>
                        <p>直接、果斷、結果導向</p>
                    </div>
                    <div class="score-card i-type">
                        <h3>I型 (影響型)</h3>
                        <div class="score-value"><?php echo $result->i_score; ?></div>
                        <p>樂觀、社交、關係導向</p>
                    </div>
                    <div class="score-card s-type">
                        <h3>S型 (穩健型)</h3>
                        <div class="score-value"><?php echo $result->s_score; ?></div>
                        <p>耐心、合作、穩定導向</p>
                    </div>
                    <div class="score-card c-type">
                        <h3>C型 (謹慎型)</h3>
                        <div class="score-value"><?php echo $result->c_score; ?></div>
                        <p>準確、分析、品質導向</p>
                    </div>
                </div>
                <?php endif; ?>
                
                <div class="results-actions">
                    <a href="<?php echo esc_url(remove_query_arg('result_id')); ?>" class="next-btn">重新測驗</a>
                    <button class="prev-btn" onclick="window.print()">打印結果</button>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * 渲染介紹頁面
     */
    public function render_intro($atts) {
        $atts = shortcode_atts(array(
            'title' => 'DISC人格理論介紹',
            'show_test_link' => 'true'
        ), $atts);
        
        ob_start();
        ?>
        <div class="disc-shortcode">
            <div class="disc-test-container">
                <div class="disc-test-header">
                    <h1><?php echo esc_html($atts['title']); ?></h1>
                    <p>了解DISC人格理論，發現您的行為風格</p>
                </div>
                
                <div class="question-container">
                    <h3>什麼是DISC人格理論？</h3>
                    <p>DISC人格理論是由心理學家威廉·馬斯頓（William Moulton Marston）在1920年代提出的行為風格理論。它將人的行為風格分為四種類型：</p>
                    
                    <div class="disc-types-intro">
                        <div class="type-intro d-type">
                            <h4>D型 - 支配型 (Dominance)</h4>
                            <p><strong>特點：</strong>直接、果斷、結果導向</p>
                            <p><strong>優勢：</strong>領導能力強，決策迅速，善於解決問題</p>
                            <p><strong>挑戰：</strong>可能過於直接，忽視他人感受</p>
                        </div>
                        
                        <div class="type-intro i-type">
                            <h4>I型 - 影響型 (Influence)</h4>
                            <p><strong>特點：</strong>樂觀、社交、關係導向</p>
                            <p><strong>優勢：</strong>善於溝通，激勵他人，創造積極氛圍</p>
                            <p><strong>挑戰：</strong>可能過於樂觀，缺乏細節關注</p>
                        </div>
                        
                        <div class="type-intro s-type">
                            <h4>S型 - 穩健型 (Steadiness)</h4>
                            <p><strong>特點：</strong>耐心、合作、穩定導向</p>
                            <p><strong>優勢：</strong>可靠穩定，善於傾聽，團隊合作能力強</p>
                            <p><strong>挑戰：</strong>可能過於保守，抗拒變化</p>
                        </div>
                        
                        <div class="type-intro c-type">
                            <h4>C型 - 謹慎型 (Conscientiousness)</h4>
                            <p><strong>特點：</strong>準確、分析、品質導向</p>
                            <p><strong>優勢：</strong>注重細節，分析能力強，追求完美</p>
                            <p><strong>挑戰：</strong>可能過於完美主義，決策緩慢</p>
                        </div>
                    </div>
                    
                    <div class="intro-footer">
                        <h3>為什麼要了解DISC？</h3>
                        <ul>
                            <li><strong>自我認知：</strong>更好地了解自己的行為模式和偏好</li>
                            <li><strong>人際關係：</strong>改善與他人的溝通和合作</li>
                            <li><strong>職業發展：</strong>找到適合的工作環境和角色</li>
                            <li><strong>團隊建設：</strong>提高團隊的協作效率</li>
                        </ul>
                        
                        <?php if ($atts['show_test_link'] === 'true'): ?>
                        <div class="test-link">
                            <a href="<?php echo esc_url(remove_query_arg('result_id')); ?>" class="next-btn">開始DISC測驗</a>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
        .disc-types-intro {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .type-intro {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid;
        }
        
        .type-intro.d-type { border-left-color: #dc3545; }
        .type-intro.i-type { border-left-color: #fd7e14; }
        .type-intro.s-type { border-left-color: #28a745; }
        .type-intro.c-type { border-left-color: #007bff; }
        
        .type-intro h4 {
            margin: 0 0 15px 0;
            font-size: 1.2em;
            font-weight: 600;
        }
        
        .type-intro p {
            margin: 8px 0;
            line-height: 1.5;
        }
        
        .intro-footer {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e9ecef;
        }
        
        .intro-footer h3 {
            margin-bottom: 20px;
            color: #2c3e50;
        }
        
        .intro-footer ul {
            margin: 20px 0;
            padding-left: 20px;
        }
        
        .intro-footer li {
            margin: 10px 0;
            line-height: 1.6;
        }
        
        .test-link {
            text-align: center;
            margin-top: 30px;
        }
        
        @media (max-width: 768px) {
            .disc-types-intro {
                grid-template-columns: 1fr;
            }
        }
        </style>
        <?php
        return ob_get_clean();
    }
    
    /**
     * 渲染已完成測驗的提示
     */
    private function render_completed_message() {
        ob_start();
        ?>
        <div class="disc-shortcode">
            <div class="results-container">
                <div class="results-header">
                    <h2>您已完成測驗</h2>
                    <p>您之前已經完成過DISC人格測驗</p>
                </div>
                <div class="results-actions">
                    <a href="<?php echo esc_url(remove_query_arg('result_id')); ?>" class="next-btn">重新測驗</a>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * 獲取測驗結果
     */
    private function get_result($result_id) {
        global $wpdb;
        $table_results = $wpdb->prefix . 'disc_results';
        
        return $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_results WHERE id = %d",
            $result_id
        ));
    }
    
    /**
     * 獲取類型名稱
     */
    private function get_type_name($type) {
        $type_names = array(
            'D' => '支配型 (Dominance)',
            'I' => '影響型 (Influence)',
            'S' => '穩健型 (Steadiness)',
            'C' => '謹慎型 (Conscientiousness)'
        );
        
        return isset($type_names[$type]) ? $type_names[$type] : $type;
    }
    
    /**
     * 獲取類型描述
     */
    private function get_type_description($type) {
        $descriptions = array(
            'D' => '您是一個直接、果斷的人，喜歡挑戰和競爭。您注重結果，善於快速決策，是天生的領導者。',
            'I' => '您是一個樂觀、熱情的人，善於與人交往。您喜歡激勵他人，創造積極的氛圍，是團隊的活力來源。',
            'S' => '您是一個耐心、可靠的人，重視和諧與合作。您善於傾聽，願意支持他人，是團隊的穩定力量。',
            'C' => '您是一個準確、分析性強的人，注重品質和細節。您善於規劃，追求完美，是團隊的品質保證。'
        );
        
        return isset($descriptions[$type]) ? $descriptions[$type] : '這是一個獨特的人格類型組合。';
    }
}
