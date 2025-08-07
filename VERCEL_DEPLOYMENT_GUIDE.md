# DISC四型人格測驗網站 - Vercel部署指南

## 🚀 概述

本指南將幫助您將DISC四型人格測驗網站部署到Vercel平台。Vercel是一個現代化的雲端部署平台，支持全棧應用部署，非常適合我們的Flask + React應用。

## 📋 部署前準備

### 1. 系統要求
- Node.js 18+ 
- Python 3.8+
- Git
- Vercel CLI (可選)

### 2. 賬戶準備
- [Vercel賬戶](https://vercel.com/signup)
- [GitHub/GitLab賬戶](https://github.com)

## 🔧 部署步驟

### 方法一：通過Vercel Dashboard部署（推薦）

#### 1. 準備代碼倉庫
```bash
# 確保代碼已推送到GitHub/GitLab
git add .
git commit -m "準備Vercel部署"
git push origin main
```

#### 2. 連接Vercel
1. 登錄 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 "New Project"
3. 選擇您的Git倉庫
4. 點擊 "Import"

#### 3. 配置項目設置
在Vercel項目設置中配置：

**Build Settings:**
- Framework Preset: `Other`
- Build Command: `cd frontend && npm run build`
- Output Directory: `frontend/dist`
- Install Command: `cd frontend && npm install`

**Environment Variables:**
```
FLASK_ENV=production
VERCEL=true
```

#### 4. 部署配置
Vercel會自動檢測 `vercel.json` 配置文件，包含：
- API路由配置
- 靜態文件服務
- 函數超時設置

### 方法二：通過Vercel CLI部署

#### 1. 安裝Vercel CLI
```bash
npm i -g vercel
```

#### 2. 登錄Vercel
```bash
vercel login
```

#### 3. 部署項目
```bash
# 在項目根目錄執行
vercel

# 按照提示配置：
# - 項目名稱: disc-personality-test
# - 目錄: ./
# - 覆蓋設置: No
```

#### 4. 生產環境部署
```bash
vercel --prod
```

## ⚙️ 配置詳解

### vercel.json 配置說明

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/main.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/main.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ],
  "env": {
    "FLASK_ENV": "production"
  },
  "functions": {
    "backend/src/main.py": {
      "maxDuration": 30
    }
  }
}
```

**配置說明：**
- `builds`: 定義構建配置
  - Python後端使用 `@vercel/python`
  - React前端使用 `@vercel/static-build`
- `routes`: 路由配置
  - `/api/*` 路由到Flask後端
  - 其他路由到React前端
- `functions`: 函數配置
  - 設置最大執行時間為30秒

### 環境變量配置

在Vercel Dashboard中設置以下環境變量：

| 變量名 | 值 | 說明 |
|--------|----|----|
| `FLASK_ENV` | `production` | Flask環境 |
| `VERCEL` | `true` | 標識Vercel環境 |

## 🔍 部署後檢查

### 1. 檢查部署狀態
- 訪問Vercel Dashboard查看部署狀態
- 檢查構建日誌是否有錯誤

### 2. 功能測試
部署完成後，測試以下功能：

#### 前端功能
- ✅ 首頁正常加載
- ✅ 介紹頁面顯示
- ✅ 測驗頁面功能
- ✅ 結果頁面展示
- ✅ 管理員頁面訪問

#### API功能
- ✅ `/api/test/questions` - 獲取測驗問題
- ✅ `/api/test/submit` - 提交測驗結果
- ✅ `/api/test/results` - 查詢歷史結果
- ✅ `/api/test/admin/login` - 管理員登錄

### 3. 性能檢查
- 頁面加載速度
- API響應時間
- 靜態資源加載

## 🛠️ 故障排除

### 常見問題及解決方案

#### 1. 構建失敗
**問題：** 前端構建失敗
**解決：**
```bash
# 檢查Node.js版本
node --version

# 清理緩存重新安裝
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. API路由404
**問題：** API端點返回404
**解決：**
- 檢查 `vercel.json` 路由配置
- 確認Flask應用正確啟動
- 檢查環境變量設置

#### 3. 數據庫問題
**問題：** 數據庫操作失敗
**解決：**
- Vercel使用臨時文件系統
- 數據會在函數重啟時重置
- 考慮使用外部數據庫服務

#### 4. 靜態文件404
**問題：** 前端資源無法加載
**解決：**
- 檢查構建輸出目錄
- 確認路由配置正確
- 檢查文件路徑

### 調試技巧

#### 1. 查看構建日誌
在Vercel Dashboard中查看詳細的構建日誌

#### 2. 本地測試
```bash
# 測試前端構建
cd frontend
npm run build

# 測試後端
cd backend
python src/main.py
```

#### 3. 環境變量檢查
```python
# 在Flask應用中添加調試信息
import os
print("Environment:", os.environ.get('VERCEL'))
print("Database path:", app.config['SQLALCHEMY_DATABASE_URI'])
```

## 📊 性能優化

### 1. 前端優化
- 啟用代碼分割
- 壓縮靜態資源
- 使用CDN加速

### 2. 後端優化
- 數據庫查詢優化
- 緩存策略
- 異步處理

### 3. Vercel特定優化
- 使用Edge Functions
- 配置緩存策略
- 優化函數大小

## 🔄 更新部署

### 自動部署
- 推送代碼到Git倉庫
- Vercel自動觸發重新部署

### 手動部署
```bash
# 使用CLI重新部署
vercel --prod

# 或通過Dashboard手動觸發
```

## 📈 監控和分析

### 1. Vercel Analytics
- 啟用Vercel Analytics
- 監控頁面性能
- 分析用戶行為

### 2. 錯誤監控
- 設置錯誤通知
- 監控API錯誤率
- 性能指標追蹤

## 🔒 安全考慮

### 1. 環境變量
- 敏感信息使用環境變量
- 不要硬編碼密鑰

### 2. CORS配置
- 正確配置CORS策略
- 限制允許的域名

### 3. 輸入驗證
- 驗證所有用戶輸入
- 防止SQL注入

## 📞 技術支持

### 獲取幫助
- [Vercel文檔](https://vercel.com/docs)
- [Vercel社區](https://github.com/vercel/vercel/discussions)
- [Flask文檔](https://flask.palletsprojects.com/)

### 常見資源
- [Vercel部署最佳實踐](https://vercel.com/docs/concepts/deployments)
- [Python函數部署](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [靜態網站部署](https://vercel.com/docs/concepts/deployments/static-deployments)

## 🎉 部署完成

部署成功後，您將獲得：
- 生產環境URL
- 自動HTTPS證書
- 全球CDN加速
- 自動擴展能力

**恭喜！您的DISC四型人格測驗網站已成功部署到Vercel！** 🚀

---

**注意：** 本指南基於當前項目結構編寫，如有更新請參考最新文檔。
