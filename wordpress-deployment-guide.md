# DISC人格測驗網站 - WordPress部署指南

## 🎯 部署方案概述

### 方案一：WordPress插件開發（推薦）
將DISC測驗功能開發為WordPress插件，保持完整功能性和現代化UI。

### 方案二：WordPress主題集成
將測驗功能集成到WordPress主題中。

### 方案三：子域名部署
將React應用部署在子域名，WordPress作為主站。

## 🚀 方案一：WordPress插件開發

### 1. 插件結構設計

```
disc-personality-test/
├── disc-personality-test.php          # 主插件文件
├── includes/                          # 核心功能
│   ├── class-disc-test.php           # 測驗核心類
│   ├── class-disc-results.php        # 結果處理類
│   ├── class-disc-admin.php          # 管理員功能
│   └── class-disc-shortcodes.php     # 短代碼處理
├── assets/                           # 前端資源
│   ├── css/
│   ├── js/
│   └── images/
├── templates/                        # 模板文件
│   ├── test-interface.php
│   ├── results-page.php
│   └── admin-dashboard.php
├── database/                         # 數據庫文件
└── languages/                        # 語言文件
```

### 2. 主插件文件開發

```php
<?php
/**
 * Plugin Name: DISC人格測驗
 * Plugin URI: https://your-website.com/disc-test
 * Description: 基於DISC人格理論的專業測驗插件
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
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
}

// 停用鉤子
register_deactivation_hook(__FILE__, 'disc_plugin_deactivate');
function disc_plugin_deactivate() {
    // 清理工作
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
```

### 3. 數據庫設計

```sql
-- 測驗結果表
CREATE TABLE wp_disc_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR(255),
    d_score INT,
    i_score INT,
    s_score INT,
    c_score INT,
    dominant_type VARCHAR(10),
    result_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 管理員設置表
CREATE TABLE wp_disc_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. 前端界面開發

#### 測驗界面模板
```php
<!-- templates/test-interface.php -->
<div class="disc-test-container">
    <div class="test-progress">
        <div class="progress-bar" style="width: <?php echo $progress; ?>%"></div>
    </div>
    
    <div class="question-container">
        <h3><?php echo $current_question['question']; ?></h3>
        
        <div class="options">
            <?php foreach ($current_question['options'] as $key => $option): ?>
            <label class="option">
                <input type="radio" name="answer" value="<?php echo $key; ?>">
                <span><?php echo $option; ?></span>
            </label>
            <?php endforeach; ?>
        </div>
        
        <button class="next-btn" onclick="nextQuestion()">下一題</button>
    </div>
</div>
```

#### CSS樣式
```css
/* assets/css/disc-test.css */
.disc-test-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
}

.test-progress {
    width: 100%;
    height: 10px;
    background: #f0f0f0;
    border-radius: 5px;
    margin-bottom: 30px;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #45a049);
    border-radius: 5px;
    transition: width 0.3s ease;
}

.question-container {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.options {
    margin: 20px 0;
}

.option {
    display: block;
    padding: 15px;
    margin: 10px 0;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.option:hover {
    border-color: #4CAF50;
    background: #f9f9f9;
}

.option input[type="radio"] {
    margin-right: 10px;
}

.next-btn {
    background: #4CAF50;
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s ease;
}

.next-btn:hover {
    background: #45a049;
}
```

### 5. JavaScript功能

```javascript
// assets/js/disc-test.js
class DISCTest {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.questions = [];
        this.init();
    }
    
    async init() {
        await this.loadQuestions();
        this.renderQuestion();
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('/wp-admin/admin-ajax.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=disc_get_questions'
            });
            this.questions = await response.json();
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    }
    
    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        
        document.querySelector('.progress-bar').style.width = progress + '%';
        document.querySelector('.question-container h3').textContent = question.question;
        
        const optionsContainer = document.querySelector('.options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const label = document.createElement('label');
            label.className = 'option';
            label.innerHTML = `
                <input type="radio" name="answer" value="${index}">
                <span>${option}</span>
            `;
            optionsContainer.appendChild(label);
        });
    }
    
    nextQuestion() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) {
            alert('請選擇一個選項');
            return;
        }
        
        this.answers.push(parseInt(selectedAnswer.value));
        
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
        } else {
            this.submitTest();
        }
    }
    
    async submitTest() {
        try {
            const response = await fetch('/wp-admin/admin-ajax.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=disc_submit_test&answers=${JSON.stringify(this.answers)}`
            });
            
            const result = await response.json();
            if (result.success) {
                window.location.href = result.redirect_url;
            }
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    }
}

// 初始化測驗
document.addEventListener('DOMContentLoaded', () => {
    new DISCTest();
});

// 全局函數供HTML調用
function nextQuestion() {
    window.discTest.nextQuestion();
}
```

### 6. 短代碼實現

```php
// includes/class-disc-shortcodes.php
class DISC_Shortcodes {
    public function __construct() {
        add_shortcode('disc_test', array($this, 'render_test'));
        add_shortcode('disc_results', array($this, 'render_results'));
    }
    
    public function render_test($atts) {
        // 檢查用戶是否已完成測驗
        if (isset($_COOKIE['disc_completed'])) {
            return $this->render_results($atts);
        }
        
        ob_start();
        include DISC_PLUGIN_PATH . 'templates/test-interface.php';
        return ob_get_clean();
    }
    
    public function render_results($atts) {
        $result_id = isset($_GET['result_id']) ? intval($_GET['result_id']) : 0;
        if (!$result_id) {
            return '<p>未找到測驗結果</p>';
        }
        
        $result = $this->get_result($result_id);
        if (!$result) {
            return '<p>測驗結果不存在</p>';
        }
        
        ob_start();
        include DISC_PLUGIN_PATH . 'templates/results-page.php';
        return ob_get_clean();
    }
}
```

## 🚀 方案二：WordPress主題集成

### 1. 創建自定義頁面模板

```php
<?php
/*
Template Name: DISC測驗頁面
*/

get_header(); ?>

<div class="disc-test-page">
    <div class="container">
        <div id="disc-test-app"></div>
    </div>
</div>

<script>
// 加載React應用
window.discTestConfig = {
    apiUrl: '<?php echo admin_url('admin-ajax.php'); ?>',
    nonce: '<?php echo wp_create_nonce('disc_test_nonce'); ?>'
};
</script>

<?php get_footer(); ?>
```

### 2. 在主題的functions.php中添加支持

```php
// functions.php
function disc_theme_enqueue_scripts() {
    if (is_page_template('page-disc-test.php')) {
        wp_enqueue_script('disc-test-app', get_template_directory_uri() . '/js/disc-test.js', array(), '1.0.0', true);
        wp_enqueue_style('disc-test-style', get_template_directory_uri() . '/css/disc-test.css', array(), '1.0.0');
    }
}
add_action('wp_enqueue_scripts', 'disc_theme_enqueue_scripts');

// AJAX處理
add_action('wp_ajax_disc_get_questions', 'disc_get_questions');
add_action('wp_ajax_nopriv_disc_get_questions', 'disc_get_questions');

function disc_get_questions() {
    $questions = array(
        array(
            'question' => '在團隊中，我傾向於：',
            'options' => array(
                '直接領導並做出決策',
                '激勵他人並建立關係',
                '支持團隊並保持和諧',
                '分析問題並確保品質'
            )
        ),
        // ... 更多問題
    );
    
    wp_send_json($questions);
}
```

## 🚀 方案三：子域名部署

### 1. 域名配置

```
主站：yourdomain.com (WordPress)
測驗：test.yourdomain.com (React應用)
```

### 2. 子域名部署步驟

1. **配置DNS記錄**
   ```
   Type: A
   Name: test
   Value: [您的服務器IP]
   ```

2. **配置Web服務器**
   ```nginx
   # Nginx配置
   server {
       listen 80;
       server_name test.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **在WordPress中添加跳轉**
   ```php
   // 在WordPress頁面中添加跳轉按鈕
   <a href="https://test.yourdomain.com" class="disc-test-btn">
       開始DISC測驗
   </a>
   ```

## 📋 部署檢查清單

### 插件開發檢查清單
- [ ] 創建插件主文件
- [ ] 設計數據庫結構
- [ ] 開發前端界面
- [ ] 實現AJAX功能
- [ ] 添加管理員功能
- [ ] 測試所有功能
- [ ] 優化性能
- [ ] 添加錯誤處理

### 主題集成檢查清單
- [ ] 創建頁面模板
- [ ] 添加CSS樣式
- [ ] 實現JavaScript功能
- [ ] 配置AJAX處理
- [ ] 測試響應式設計
- [ ] 優化加載速度

### 子域名部署檢查清單
- [ ] 配置DNS記錄
- [ ] 設置Web服務器
- [ ] 部署React應用
- [ ] 配置SSL證書
- [ ] 測試跨域功能
- [ ] 設置監控

## 🔧 性能優化建議

### 1. 緩存策略
- 使用WordPress緩存插件
- 實現Redis緩存
- 優化數據庫查詢

### 2. 資源優化
- 壓縮CSS和JavaScript
- 使用CDN加速
- 優化圖片大小

### 3. 安全措施
- 實現CSRF保護
- 添加輸入驗證
- 使用WordPress安全插件

## 📞 技術支持

如果在部署過程中遇到問題，請：
1. 檢查WordPress錯誤日誌
2. 確認PHP版本兼容性
3. 驗證數據庫權限
4. 測試AJAX功能

---

**注意**：建議先在本地環境測試所有功能，確認無誤後再部署到生產環境。
