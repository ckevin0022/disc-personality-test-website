# DISC人格測驗 WordPress插件

## 📋 插件簡介

這是一個完整的DISC人格測驗WordPress插件，提供專業的DISC人格類型分析功能。

## 🚀 功能特色

- ✅ **完整的DISC測驗**：24題專業測驗題目
- ✅ **現代化界面**：響應式設計，支持多種設備
- ✅ **結果分析**：詳細的DISC分數和類型分析
- ✅ **管理員功能**：完整的後台管理系統
- ✅ **短代碼支持**：靈活的頁面集成方式
- ✅ **數據統計**：測驗結果統計和分析
- ✅ **多語言支持**：支持中文界面

## 📦 安裝步驟

### 方法一：手動安裝

1. **下載插件文件**
   - 將整個 `disc-personality-test` 文件夾上傳到 `/wp-content/plugins/` 目錄

2. **激活插件**
   - 在WordPress後台 → 插件 → 已安裝的插件
   - 找到 "DISC人格測驗" 並點擊 "啟用"

3. **配置插件**
   - 插件會自動創建必要的數據表
   - 默認管理員密碼：`admin123`

### 方法二：ZIP包安裝

1. **打包插件**
   ```bash
   cd disc-personality-test
   zip -r disc-personality-test.zip .
   ```

2. **上傳安裝**
   - 在WordPress後台 → 插件 → 安裝插件
   - 點擊 "上傳插件" 並選擇ZIP文件
   - 點擊 "立即安裝" 並激活

## 🎯 使用方法

### 1. 使用短代碼

#### 基本測驗
```
[disc_test]
```

#### 自定義標題和描述
```
[disc_test title="我的DISC測驗" description="了解您的行為風格"]
```

#### 隱藏進度條
```
[disc_test show_progress="false"]
```

#### 顯示測驗結果
```
[disc_results]
```

#### 顯示介紹頁面
```
[disc_intro]
```

### 2. 創建專用頁面

1. **創建新頁面**
   - 在WordPress後台創建新頁面
   - 標題：DISC人格測驗

2. **添加短代碼**
   ```
   [disc_intro]
   
   [disc_test]
   ```

3. **發布頁面**
   - 設置頁面為公開
   - 訪問頁面測試功能

### 3. 管理員功能

#### 訪問管理面板
- 在WordPress後台菜單中找到 "DISC測驗"
- 點擊進入管理面板

#### 查看統計數據
- 總測驗次數
- 各類型分布
- 最近測驗結果

#### 導出數據
- 支持CSV和JSON格式
- 包含完整的測驗數據

## 🔧 配置選項

### 修改管理員密碼

1. 在管理面板中點擊 "設置"
2. 輸入新密碼並保存

### 自定義測驗標題

```php
// 在主題的 functions.php 中添加
add_filter('disc_test_title', function($title) {
    return '我的DISC測驗';
});
```

### 自定義問題

修改 `disc-personality-test.php` 文件中的問題數組：

```php
$questions = array(
    array(
        'id' => 1,
        'question' => '您的問題',
        'options' => array(
            '選項1',
            '選項2',
            '選項3',
            '選項4'
        )
    ),
    // ... 更多問題
);
```

## 📊 數據庫結構

插件會自動創建以下數據表：

### wp_disc_results
- `id`: 結果ID
- `user_id`: 用戶ID
- `session_id`: 會話ID
- `d_score`: D型分數
- `i_score`: I型分數
- `s_score`: S型分數
- `c_score`: C型分數
- `dominant_type`: 主導類型
- `result_data`: 原始答案數據
- `created_at`: 創建時間

### wp_disc_settings
- `id`: 設置ID
- `setting_key`: 設置鍵
- `setting_value`: 設置值
- `updated_at`: 更新時間

## 🎨 自定義樣式

### 修改CSS樣式

編輯 `assets/css/disc-test.css` 文件來自定義外觀：

```css
/* 自定義主題顏色 */
.disc-test-header {
    background: linear-gradient(135deg, #your-color1, #your-color2);
}

/* 自定義按鈕樣式 */
.next-btn {
    background: #your-button-color;
}
```

### 響應式設計

插件已內建響應式設計，支持：
- 桌面電腦
- 平板電腦
- 手機設備

## 🔒 安全考慮

### 數據保護
- 所有用戶輸入都經過驗證和清理
- 使用WordPress內建的安全函數
- 支持CSRF保護

### 權限控制
- 管理員功能需要WordPress管理員權限
- 測驗結果與用戶ID關聯
- 支持訪客測驗

## 🐛 故障排除

### 常見問題

1. **插件無法激活**
   - 檢查PHP版本（需要7.0+）
   - 確認WordPress版本（需要5.0+）
   - 檢查文件權限

2. **測驗無法加載**
   - 檢查JavaScript控制台錯誤
   - 確認AJAX功能正常
   - 檢查數據庫連接

3. **樣式顯示異常**
   - 清除瀏覽器緩存
   - 檢查主題CSS衝突
   - 確認CSS文件路徑正確

### 調試模式

啟用WordPress調試模式：

```php
// 在 wp-config.php 中
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## 📈 性能優化

### 緩存建議
- 使用WordPress緩存插件
- 啟用瀏覽器緩存
- 壓縮CSS和JavaScript

### 數據庫優化
- 定期清理舊數據
- 優化數據庫查詢
- 使用索引提高查詢速度

## 🔄 更新和維護

### 備份數據
更新前請備份：
- 插件文件
- 數據庫表
- 自定義設置

### 版本更新
1. 停用舊版本插件
2. 上傳新版本文件
3. 重新激活插件
4. 檢查功能正常

## 📞 技術支持

### 獲取幫助
- 檢查WordPress錯誤日誌
- 查看瀏覽器控制台錯誤
- 確認服務器環境要求

### 環境要求
- WordPress 5.0+
- PHP 7.0+
- MySQL 5.6+
- 現代瀏覽器支持

## 📄 許可證

本插件採用 GPL v2 或更高版本許可證。

## 🙏 致謝

感謝所有為此插件做出貢獻的開發者和用戶。

---

**注意**：這是一個開發版本，建議在測試環境中充分測試後再部署到生產環境。
