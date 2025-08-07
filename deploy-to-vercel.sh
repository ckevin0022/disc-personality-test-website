#!/bin/bash

# DISC四型人格測驗網站 - Vercel部署腳本
# 作者: Manus AI
# 版本: 1.0

echo "=========================================="
echo "DISC四型人格測驗網站 - Vercel部署程序"
echo "=========================================="

# 檢查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝。請先安裝 Node.js 18+ 版本"
    echo "下載地址: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本過低，需要 18+ 版本"
    exit 1
fi

echo "✅ Node.js $(node --version) 已安裝"

# 檢查Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安裝。請先安裝 Python 3.8+ 版本"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1-2)
echo "✅ Python $PYTHON_VERSION 已安裝"

# 檢查Git
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安裝。請先安裝 Git"
    exit 1
fi

echo "✅ Git $(git --version | cut -d' ' -f3) 已安裝"

# 檢查是否在Git倉庫中
if [ ! -d ".git" ]; then
    echo "❌ 當前目錄不是Git倉庫"
    echo "請先初始化Git倉庫："
    echo "git init"
    echo "git add ."
    echo "git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Git倉庫已初始化"

# 構建前端
echo ""
echo "正在構建前端..."
cd frontend

# 安裝依賴
if command -v pnpm &> /dev/null; then
    echo "使用 pnpm 安裝依賴..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "使用 yarn 安裝依賴..."
    yarn install
else
    echo "使用 npm 安裝依賴..."
    npm install
fi

if [ $? -ne 0 ]; then
    echo "❌ 前端依賴安裝失敗"
    exit 1
fi

# 構建項目
if command -v pnpm &> /dev/null; then
    pnpm run build
elif command -v yarn &> /dev/null; then
    yarn build
else
    npm run build
fi

if [ $? -ne 0 ]; then
    echo "❌ 前端構建失敗"
    exit 1
fi

echo "✅ 前端構建完成"

# 返回根目錄
cd ..

# 檢查Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo ""
    echo "Vercel CLI 未安裝，正在安裝..."
    npm install -g vercel
    
    if [ $? -ne 0 ]; then
        echo "❌ Vercel CLI 安裝失敗"
        echo "請手動安裝: npm install -g vercel"
        exit 1
    fi
fi

echo "✅ Vercel CLI 已安裝"

# 檢查是否已登錄Vercel
echo ""
echo "檢查Vercel登錄狀態..."
if ! vercel whoami &> /dev/null; then
    echo "請先登錄Vercel："
    vercel login
fi

echo "✅ Vercel 已登錄"

# 提交代碼到Git
echo ""
echo "提交代碼到Git倉庫..."
git add .
git commit -m "準備Vercel部署 - $(date)"

# 推送到遠程倉庫
echo "推送到遠程倉庫..."
if git remote -v | grep -q origin; then
    git push origin main
else
    echo "⚠️  未找到遠程倉庫，請手動添加："
    echo "git remote add origin <your-repo-url>"
    echo "git push -u origin main"
fi

echo ""
echo "=========================================="
echo "🎉 部署準備完成！"
echo "=========================================="
echo ""
echo "下一步操作："
echo ""
echo "方法一：通過Vercel Dashboard部署（推薦）"
echo "1. 訪問 https://vercel.com/dashboard"
echo "2. 點擊 'New Project'"
echo "3. 選擇您的Git倉庫"
echo "4. 配置構建設置："
echo "   - Framework Preset: Other"
echo "   - Build Command: cd frontend && npm run build"
echo "   - Output Directory: frontend/dist"
echo "5. 點擊 'Deploy'"
echo ""
echo "方法二：通過CLI部署"
echo "1. 在項目根目錄執行: vercel"
echo "2. 按照提示配置項目"
echo "3. 部署到生產環境: vercel --prod"
echo ""
echo "部署完成後，您將獲得一個生產環境URL"
echo "=========================================="
