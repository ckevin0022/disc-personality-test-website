# DISC人格測驗網站

一個基於DISC人格理論的現代化測驗網站，提供個性化的人格分析報告。

## 🎯 項目特色

- **完整的DISC測驗**：基於權威的DISC人格理論設計
- **現代化UI/UX**：響應式設計，支持多種設備
- **個性化報告**：生成詳細的PDF格式測驗報告
- **管理員功能**：完整的後台管理系統
- **數據分析**：測驗結果統計和分析功能

## 🏗️ 技術架構

### 前端技術
- **React 18** - 現代化前端框架
- **Vite** - 快速構建工具
- **Tailwind CSS** - 實用優先的CSS框架
- **React Router** - 單頁應用路由

### 後端技術
- **Flask** - Python Web框架
- **SQLAlchemy** - ORM數據庫操作
- **SQLite** - 輕量級數據庫
- **ReportLab** - PDF報告生成

## 📁 項目結構

```
disc-deployment-package/
├── frontend/                 # React前端應用
│   ├── src/                 # 源代碼
│   ├── public/              # 靜態資源
│   ├── dist/                # 構建輸出
│   └── package.json         # 前端依賴
├── backend/                 # Flask後端應用
│   ├── src/                 # 源代碼
│   │   ├── models/          # 數據模型
│   │   ├── routes/          # API路由
│   │   ├── static/          # 靜態文件
│   │   └── database/        # 數據庫文件
│   ├── venv/                # Python虛擬環境
│   └── requirements.txt     # Python依賴
├── scripts/                 # 部署腳本
├── docs/                    # 項目文檔
└── README.md               # 項目說明
```

## 🚀 快速開始

### 環境要求
- Python 3.8+
- Node.js 16+
- pnpm (推薦) 或 npm

### 安裝步驟

1. **克隆項目**
   ```bash
   git clone <repository-url>
   cd disc-deployment-package
   ```

2. **設置後端**
   ```bash
   cd backend
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **設置前端**
   ```bash
   cd ../frontend
   pnpm install
   ```

4. **啟動應用**
   ```bash
   # 啟動後端 (在backend目錄)
   python src/main.py
   
   # 啟動前端 (在frontend目錄)
   pnpm dev
   ```

5. **訪問網站**
   - 主頁：http://localhost:5000
   - 管理員頁面：http://localhost:5000/admin

## 📋 功能模塊

### 用戶功能
- **測驗介紹**：了解DISC理論和測驗流程
- **人格測驗**：24題專業DISC測驗
- **結果分析**：詳細的人格特徵分析
- **PDF報告**：可下載的個性化報告

### 管理員功能
- **登錄系統**：安全的管理員認證
- **結果查看**：查看所有測驗結果
- **數據統計**：測驗數據分析
- **密碼管理**：修改管理員密碼

## 🔧 配置說明

### 環境變量
創建 `.env` 文件：
```env
FLASK_SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///app.db
```

### 數據庫初始化
```bash
cd backend
python src/init_db.py
```

## 📊 DISC理論簡介

DISC人格理論將人的行為風格分為四種類型：

- **D (Dominance)** - 支配型：直接、果斷、結果導向
- **I (Influence)** - 影響型：樂觀、社交、關係導向  
- **S (Steadiness)** - 穩健型：耐心、合作、穩定導向
- **C (Conscientiousness)** - 謹慎型：準確、分析、品質導向

## 🤝 貢獻指南

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 許可證

本項目採用 MIT 許可證 - 查看 [LICENSE](LICENSE) 文件了解詳情

## 📞 聯繫方式

如有問題或建議，請通過以下方式聯繫：
- 提交 Issue
- 發送郵件至：[your-email@example.com]

## 🙏 致謝

感謝所有為此項目做出貢獻的開發者和設計師。

---

**注意**：這是一個開發版本，請勿在生產環境中使用。如需生產部署，請參考部署文檔。
