#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
DISC人格測驗網站 - 數據庫初始化腳本
"""

import os
import sys
from werkzeug.security import generate_password_hash

# 添加src目錄到Python路徑
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app, db
from models.user import User
from models.test_result import TestResult, AdminSettings

def init_database():
    """初始化數據庫"""
    print("正在初始化數據庫...")
    
    with app.app_context():
        # 創建所有表
        db.create_all()
        print("✅ 數據庫表創建完成")
        
        # 檢查是否已有管理員設置
        admin_settings = AdminSettings.query.first()
        if not admin_settings:
            # 創建默認管理員設置
            default_password = "123456"
            password_hash = generate_password_hash(default_password)
            
            admin_settings = AdminSettings(
                password_hash=password_hash,
                setting_key='admin_password',
                setting_value='default'
            )
            
            db.session.add(admin_settings)
            db.session.commit()
            print(f"✅ 默認管理員密碼設置完成: {default_password}")
        else:
            print("✅ 管理員設置已存在")
        
        print("✅ 數據庫初始化完成")

if __name__ == '__main__':
    init_database()

