#!/bin/bash

# DISC人格測驗網站本地部署安裝腳本
# 作者: Manus AI
# 版本: 1.0

echo "=========================================="
echo "DISC人格測驗網站 - 本地部署安裝程序"
echo "=========================================="

# 檢查系統要求
echo "正在檢查系統要求..."

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

# 檢查pip
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 未安裝。請先安裝 pip"
    exit 1
fi

echo "✅ pip3 已安裝"

# 安裝前端依賴
echo ""
echo "正在安裝前端依賴..."
cd frontend
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

echo "✅ 前端依賴安裝完成"

# 構建前端
echo "正在構建前端..."
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

# 安裝後端依賴
echo ""
echo "正在安裝後端依賴..."
cd ../backend

# 創建虛擬環境
if [ ! -d "venv" ]; then
    echo "創建Python虛擬環境..."
    python3 -m venv venv
fi

# 激活虛擬環境並安裝依賴
echo "安裝Python依賴..."
source venv/bin/activate
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ 後端依賴安裝失敗"
    exit 1
fi

echo "✅ 後端依賴安裝完成"

# 複製前端構建文件到後端
echo "正在整合前後端..."
cp -r ../frontend/dist/* src/static/

# 初始化數據庫
echo "正在初始化數據庫..."
python src/init_db.py

echo ""
echo "=========================================="
echo "🎉 安裝完成！"
echo "=========================================="
echo ""
echo "啟動方式："
echo "1. 進入 backend 目錄: cd backend"
echo "2. 激活虛擬環境: source venv/bin/activate"
echo "3. 啟動服務器: python src/main.py"
echo "4. 打開瀏覽器訪問: http://localhost:5000"
echo ""
echo "默認管理員密碼: 123456"
echo "建議首次登錄後立即修改密碼"
echo ""
echo "如需幫助，請查看 docs/README.md"
echo "=========================================="

