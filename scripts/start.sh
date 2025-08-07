#!/bin/bash

# DISC人格測驗網站啟動腳本

echo "=========================================="
echo "啟動 DISC人格測驗網站"
echo "=========================================="

# 檢查是否在正確目錄
if [ ! -d "backend" ]; then
    echo "❌ 請在項目根目錄執行此腳本"
    exit 1
fi

# 進入後端目錄
cd backend

# 檢查虛擬環境
if [ ! -d "venv" ]; then
    echo "❌ 虛擬環境不存在，請先運行 ./scripts/setup.sh"
    exit 1
fi

# 激活虛擬環境
echo "激活虛擬環境..."
source venv/bin/activate

# 檢查依賴
if [ ! -f "venv/lib/python*/site-packages/flask/__init__.py" ]; then
    echo "❌ Flask 未安裝，請先運行 ./scripts/setup.sh"
    exit 1
fi

echo "✅ 環境檢查完成"
echo ""
echo "🚀 啟動服務器..."
echo "訪問地址: http://localhost:5000"
echo "管理員頁面: http://localhost:5000/admin"
echo "按 Ctrl+C 停止服務器"
echo ""

# 啟動Flask應用
python src/main.py

