# Vercel部署檢查清單

## 📋 部署前檢查

### ✅ 環境要求
- [ ] Node.js 18+ 已安裝
- [ ] Python 3.8+ 已安裝
- [ ] Git 已安裝
- [ ] Vercel CLI 已安裝 (`npm install -g vercel`)

### ✅ 代碼準備
- [ ] 代碼已推送到Git倉庫
- [ ] `vercel.json` 配置文件已創建
- [ ] 前端構建成功 (`npm run build`)
- [ ] 後端依賴已安裝 (`pip install -r requirements.txt`)

### ✅ 配置文件檢查
- [ ] `vercel.json` - Vercel部署配置
- [ ] `frontend/package.json` - 前端依賴和腳本
- [ ] `backend/requirements.txt` - 後端依賴
- [ ] `backend/src/main.py` - Flask應用配置

## 🚀 部署步驟

### 方法一：Vercel Dashboard（推薦）

#### 1. 項目設置
- [ ] 登錄 [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] 點擊 "New Project"
- [ ] 選擇Git倉庫
- [ ] 點擊 "Import"

#### 2. 構建設置
- [ ] Framework Preset: `Other`
- [ ] Build Command: `cd frontend && npm run build`
- [ ] Output Directory: `frontend/dist`
- [ ] Install Command: `cd frontend && npm install`

#### 3. 環境變量
- [ ] `FLASK_ENV` = `production`
- [ ] `VERCEL` = `true`

#### 4. 部署
- [ ] 點擊 "Deploy"
- [ ] 等待構建完成
- [ ] 檢查部署狀態

### 方法二：Vercel CLI

#### 1. 登錄
- [ ] 執行 `vercel login`
- [ ] 完成身份驗證

#### 2. 部署
- [ ] 在項目根目錄執行 `vercel`
- [ ] 按照提示配置項目
- [ ] 執行 `vercel --prod` 部署到生產環境

## 🔍 部署後檢查

### ✅ 功能測試
- [ ] 首頁正常加載
- [ ] 介紹頁面顯示
- [ ] 測驗頁面功能正常
- [ ] 結果頁面展示正確
- [ ] 管理員頁面可訪問

### ✅ API測試
- [ ] `/api/test/questions` - 獲取測驗問題
- [ ] `/api/test/submit` - 提交測驗結果
- [ ] `/api/test/results` - 查詢歷史結果
- [ ] `/api/test/admin/login` - 管理員登錄

### ✅ 性能檢查
- [ ] 頁面加載速度正常
- [ ] API響應時間合理
- [ ] 靜態資源加載成功
- [ ] 移動端適配正常

## 🛠️ 故障排除

### 常見問題
- [ ] 構建失敗 - 檢查Node.js版本和依賴
- [ ] API 404 - 檢查路由配置
- [ ] 靜態文件404 - 檢查構建輸出
- [ ] 數據庫錯誤 - 檢查環境變量

### 調試步驟
- [ ] 查看Vercel構建日誌
- [ ] 檢查瀏覽器控制台錯誤
- [ ] 驗證環境變量設置
- [ ] 測試本地構建

## 📊 監控設置

### 性能監控
- [ ] 啟用Vercel Analytics
- [ ] 設置性能監控
- [ ] 配置錯誤通知

### 安全檢查
- [ ] HTTPS證書正常
- [ ] CORS配置正確
- [ ] 環境變量安全

## 🔄 更新部署

### 自動部署
- [ ] 推送代碼到Git倉庫
- [ ] Vercel自動觸發部署
- [ ] 檢查新版本功能

### 手動部署
- [ ] 執行 `vercel --prod`
- [ ] 或通過Dashboard手動觸發

## 📞 支持資源

### 文檔鏈接
- [ ] [Vercel文檔](https://vercel.com/docs)
- [ ] [Flask文檔](https://flask.palletsprojects.com/)
- [ ] [React文檔](https://react.dev/)

### 社區支持
- [ ] [Vercel社區](https://github.com/vercel/vercel/discussions)
- [ ] [Stack Overflow](https://stackoverflow.com/questions/tagged/vercel)

---

**部署完成後，請保存生產環境URL並分享給用戶！** 🎉
