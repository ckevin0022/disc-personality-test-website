#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.models.user import db
from src.models.test_result import TestResult
from src.main import app
import json

def create_test_data():
    with app.app_context():
        # 創建測試數據
        test_answers = {
            "1": {"text": "決定者：意見不同時，通常我都是決定者。", "type": "D"},
            "2": {"text": "不易受售貨員之影響，心中自有定見。", "type": "D"},
            "3": {"text": "主導話題，引領討論方向。", "type": "D"},
            "4": {"text": "迎接挑戰，積極解決問題。", "type": "D"},
            "5": {"text": "擔任領導角色，指揮協調。", "type": "D"},
            "6": {"text": "效率和結果。", "type": "D"},
            "7": {"text": "直接明確，言簡意賅。", "type": "D"},
            "8": {"text": "主動適應，尋找機會。", "type": "D"},
            "9": {"text": "目標導向，追求成果。", "type": "D"},
            "10": {"text": "直面問題，尋求解決方案。", "type": "D"}
        }
        
        test_result = TestResult(
            employee_id='TEST001',
            name='張小明',
            email='zhang@test.com',
            d_score=8,
            i_score=2,
            s_score=1,
            c_score=1,
            primary_type='D',
            secondary_type='I'
        )
        test_result.set_answers(test_answers)
        
        db.session.add(test_result)
        db.session.commit()
        
        print(f"測試數據已創建，ID: {test_result.id}")
        return test_result.id

if __name__ == '__main__':
    test_id = create_test_data()
    print(f"可以使用以下URL測試PDF生成：")
    print(f"http://localhost:5000/api/pdf/generate/{test_id}")
    print(f"http://localhost:5000/api/pdf/preview/{test_id}")

