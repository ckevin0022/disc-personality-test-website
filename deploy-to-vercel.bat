@echo off
chcp 65001 >nul

echo ==========================================
echo DISC四型人格測驗網站 - Vercel部署程序
echo ==========================================

REM 檢查Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安裝。請先安裝 Node.js 18+ 版本
    echo 下載地址: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1,2,3 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 18 (
    echo ❌ Node.js 版本過低，需要 18+ 版本
    pause
    exit /b 1
)

echo ✅ Node.js 已安裝

REM 檢查Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 未安裝。請先安裝 Python 3.8+ 版本
    pause
    exit /b 1
)

echo ✅ Python 已安裝

REM 檢查Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git 未安裝。請先安裝 Git
    pause
    exit /b 1
)

echo ✅ Git 已安裝

REM 檢查是否在Git倉庫中
if not exist ".git" (
    echo ❌ 當前目錄不是Git倉庫
    echo 請先初始化Git倉庫：
    echo git init
    echo git add .
    echo git commit -m "Initial commit"
    pause
    exit /b 1
)

echo ✅ Git倉庫已初始化

REM 構建前端
echo.
echo 正在構建前端...
cd frontend

REM 安裝依賴
echo 安裝前端依賴...
call npm install
if errorlevel 1 (
    echo ❌ 前端依賴安裝失敗
    pause
    exit /b 1
)

REM 構建項目
echo 構建前端項目...
call npm run build
if errorlevel 1 (
    echo ❌ 前端構建失敗
    pause
    exit /b 1
)

echo ✅ 前端構建完成

REM 返回根目錄
cd ..

REM 檢查Vercel CLI
vercel --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo Vercel CLI 未安裝，正在安裝...
    call npm install -g vercel
    if errorlevel 1 (
        echo ❌ Vercel CLI 安裝失敗
        echo 請手動安裝: npm install -g vercel
        pause
        exit /b 1
    )
)

echo ✅ Vercel CLI 已安裝

REM 檢查是否已登錄Vercel
echo.
echo 檢查Vercel登錄狀態...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 請先登錄Vercel：
    vercel login
)

echo ✅ Vercel 已登錄

REM 提交代碼到Git
echo.
echo 提交代碼到Git倉庫...
git add .
git commit -m "準備Vercel部署 - %date% %time%"

REM 推送到遠程倉庫
echo 推送到遠程倉庫...
git remote -v | findstr origin >nul
if errorlevel 1 (
    echo ⚠️  未找到遠程倉庫，請手動添加：
    echo git remote add origin ^<your-repo-url^>
    echo git push -u origin main
) else (
    git push origin main
)

echo.
echo ==========================================
echo 🎉 部署準備完成！
echo ==========================================
echo.
echo 下一步操作：
echo.
echo 方法一：通過Vercel Dashboard部署（推薦）
echo 1. 訪問 https://vercel.com/dashboard
echo 2. 點擊 'New Project'
echo 3. 選擇您的Git倉庫
echo 4. 配置構建設置：
echo    - Framework Preset: Other
echo    - Build Command: cd frontend ^&^& npm run build
echo    - Output Directory: frontend/dist
echo 5. 點擊 'Deploy'
echo.
echo 方法二：通過CLI部署
echo 1. 在項目根目錄執行: vercel
echo 2. 按照提示配置項目
echo 3. 部署到生產環境: vercel --prod
echo.
echo 部署完成後，您將獲得一個生產環境URL
echo ==========================================

pause
