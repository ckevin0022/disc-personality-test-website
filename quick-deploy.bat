@echo off
chcp 65001 >nul

echo ==========================================
echo DISC四型人格測驗網站 - 快速部署
echo ==========================================

echo ✅ Node.js 版本檢查...
node --version
if errorlevel 1 (
    echo ❌ Node.js 未安裝或版本過低
    pause
    exit /b 1
)

echo ✅ 前端構建...
cd frontend
call npm run build
if errorlevel 1 (
    echo ❌ 前端構建失敗
    pause
    exit /b 1
)
cd ..

echo ✅ 複製靜態文件...
if exist "backend\src\static\assets" (
    rmdir /s /q "backend\src\static\assets"
)
if exist "backend\src\static\index.html" (
    del "backend\src\static\index.html"
)
xcopy "frontend\dist\*" "backend\src\static\" /E /Y

echo ✅ Vercel CLI 檢查...
vercel --version
if errorlevel 1 (
    echo ❌ Vercel CLI 未安裝
    echo 正在安裝 Vercel CLI...
    call npm install -g vercel
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
echo 1. 執行: vercel login
echo 2. 執行: vercel
echo 3. 部署到生產環境: vercel --prod
echo.
echo 部署完成後，您將獲得一個生產環境URL
echo ==========================================

pause
