# 四型人格測驗網站架構設計

## 網站整體架構

### 前端架構（React）
```
src/
├── components/           # 共用組件
│   ├── Header/          # 導航欄
│   ├── Footer/          # 頁腳
│   ├── Layout/          # 頁面佈局
│   ├── Button/          # 按鈕組件
│   ├── Card/            # 卡片組件
│   └── Modal/           # 彈窗組件
├── pages/               # 頁面組件
│   ├── Home/            # 首頁
│   ├── Introduction/    # 四型人格介紹
│   ├── Test/            # 測驗頁面
│   ├── Result/          # 結果頁面
│   └── Admin/           # 管理員頁面
├── hooks/               # 自定義Hook
├── utils/               # 工具函數
├── styles/              # 樣式文件
└── api/                 # API調用
```

### 後端架構（Flask）
```
app/
├── models/              # 數據模型
│   ├── user.py         # 用戶模型
│   ├── test_result.py  # 測驗結果模型
│   └── question.py     # 問題模型
├── routes/              # 路由
│   ├── auth.py         # 認證路由
│   ├── test.py         # 測驗路由
│   ├── admin.py        # 管理員路由
│   └── report.py       # 報告生成路由
├── services/            # 業務邏輯
│   ├── test_service.py # 測驗邏輯
│   ├── pdf_service.py  # PDF生成
│   └── admin_service.py # 管理功能
├── utils/               # 工具函數
└── config.py           # 配置文件
```

## 功能模組設計

### 1. 四型人格介紹模組
- **頁面路徑**: `/introduction`
- **功能描述**: 
  - 展示DISC四型人格理論介紹
  - 每種類型的詳細特徵說明
  - 動物代表和色彩展示
  - 科技感的動畫效果

### 2. 人格測驗模組
- **頁面路徑**: `/test`
- **功能描述**:
  - 用戶信息收集（工號、姓名、電子郵件）
  - 24題DISC測驗問題
  - 進度條顯示
  - 自動保存功能
  - 結果計算和分析

### 3. 結果展示模組
- **頁面路徑**: `/result`
- **功能描述**:
  - 人格類型結果展示
  - 詳細的人格分析報告
  - 職業建議和發展方向
  - 能力指標雷達圖
  - PDF報告下載功能

### 4. 管理員查詢模組
- **頁面路徑**: `/admin`
- **功能描述**:
  - 密碼驗證（預設：123456）
  - 歷史測驗記錄查詢
  - 測驗結果匯出（Excel/CSV）
  - 密碼變更功能
  - 數據統計圖表

## 數據庫設計

### 用戶表 (users)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 測驗結果表 (test_results)
```sql
CREATE TABLE test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    d_score INTEGER NOT NULL,
    i_score INTEGER NOT NULL,
    s_score INTEGER NOT NULL,
    c_score INTEGER NOT NULL,
    primary_type VARCHAR(10) NOT NULL,
    secondary_type VARCHAR(10),
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### 測驗問題表 (questions)
```sql
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    type_a VARCHAR(1) NOT NULL,
    type_b VARCHAR(1) NOT NULL,
    type_c VARCHAR(1) NOT NULL,
    type_d VARCHAR(1) NOT NULL
);
```

### 管理員設置表 (admin_settings)
```sql
CREATE TABLE admin_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API設計

### 測驗相關API
- `POST /api/test/start` - 開始測驗，保存用戶信息
- `GET /api/test/questions` - 獲取測驗問題
- `POST /api/test/submit` - 提交測驗答案
- `GET /api/test/result/{test_id}` - 獲取測驗結果

### 報告相關API
- `GET /api/report/pdf/{test_id}` - 生成並下載PDF報告
- `GET /api/report/data/{test_id}` - 獲取報告數據

### 管理員相關API
- `POST /api/admin/login` - 管理員登錄驗證
- `GET /api/admin/results` - 獲取所有測驗結果
- `GET /api/admin/export` - 匯出測驗數據
- `POST /api/admin/change-password` - 變更管理員密碼

## 技術棧選擇

### 前端技術
- **框架**: React 18
- **狀態管理**: React Context + useReducer
- **路由**: React Router v6
- **UI庫**: Material-UI 或 Ant Design
- **圖表**: Chart.js 或 Recharts
- **動畫**: Framer Motion
- **樣式**: Styled-components 或 CSS Modules

### 後端技術
- **框架**: Flask
- **數據庫**: SQLite（開發）/ PostgreSQL（生產）
- **ORM**: SQLAlchemy
- **PDF生成**: ReportLab 或 WeasyPrint
- **數據匯出**: Pandas + openpyxl
- **認證**: Flask-Session

### 部署技術
- **前端部署**: Vercel 或 Netlify
- **後端部署**: Heroku 或 Railway
- **數據庫**: PostgreSQL（雲端）

## 科技感設計元素

### 視覺設計
- **色彩方案**: 深藍色主色調，配合霓虹藍、紫色漸變
- **字體**: 現代無襯線字體（如 Inter、Roboto）
- **圖標**: 線性圖標，配合發光效果
- **背景**: 粒子動畫、幾何圖形

### 交互設計
- **按鈕**: 發光邊框、懸停動畫
- **卡片**: 玻璃擬態效果、陰影層次
- **進度條**: 動態填充動畫
- **圖表**: 動態數據可視化

### 動畫效果
- **頁面切換**: 淡入淡出、滑動效果
- **元素載入**: 從下往上浮現
- **數據展示**: 數字滾動動畫
- **背景**: 微妙的粒子移動

