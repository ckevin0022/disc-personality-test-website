from flask import Blueprint, jsonify, request
from src.models.test_result import TestResult, AdminSettings, db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import hashlib

test_bp = Blueprint('test', __name__)

# DISC測驗問題庫
DISC_QUESTIONS = [
    {
        "id": 1,
        "question": "當你和朋友一起用餐，在選擇餐廳或什麼時，您是？",
        "options": [
            {"text": "決定者：意見不同時，通常我都是決定者。", "type": "D"},
            {"text": "氣氛製造者：不管吃什麼，我都能帶動氣氛。", "type": "I"},
            {"text": "附和者：隨便，沒意見。", "type": "S"},
            {"text": "意見提供者：常去否定別人之提議，自己卻又沒意見，不做決定。", "type": "C"}
        ]
    },
    {
        "id": 2,
        "question": "當您買衣服時，您是？",
        "options": [
            {"text": "不易受售貨員之影響，心中自有定見。", "type": "D"},
            {"text": "售貨員的親切友好的態度，常會促使您的購買。", "type": "I"},
            {"text": "找熟悉的店員。", "type": "S"},
            {"text": "品質與價錢是否成比例，價錢是否合理。", "type": "C"}
        ]
    },
    {
        "id": 3,
        "question": "在社交場合中，您通常是？",
        "options": [
            {"text": "主導話題，引領討論方向。", "type": "D"},
            {"text": "活躍參與，善於調節氣氛。", "type": "I"},
            {"text": "安靜傾聽，適時回應。", "type": "S"},
            {"text": "觀察分析，謹慎發言。", "type": "C"}
        ]
    },
    {
        "id": 4,
        "question": "面對工作壓力時，您的反應是？",
        "options": [
            {"text": "迎接挑戰，積極解決問題。", "type": "D"},
            {"text": "尋求團隊支持，共同面對。", "type": "I"},
            {"text": "按部就班，穩定處理。", "type": "S"},
            {"text": "仔細分析，制定詳細計劃。", "type": "C"}
        ]
    },
    {
        "id": 5,
        "question": "在團隊合作中，您傾向於？",
        "options": [
            {"text": "擔任領導角色，指揮協調。", "type": "D"},
            {"text": "促進溝通，維持團隊和諧。", "type": "I"},
            {"text": "支持配合，穩定執行任務。", "type": "S"},
            {"text": "提供專業意見，確保品質。", "type": "C"}
        ]
    },
    {
        "id": 6,
        "question": "做決策時，您最重視？",
        "options": [
            {"text": "效率和結果。", "type": "D"},
            {"text": "團隊共識和影響。", "type": "I"},
            {"text": "穩定性和安全性。", "type": "S"},
            {"text": "準確性和邏輯性。", "type": "C"}
        ]
    },
    {
        "id": 7,
        "question": "您的溝通風格是？",
        "options": [
            {"text": "直接明確，言簡意賅。", "type": "D"},
            {"text": "熱情友好，表達豐富。", "type": "I"},
            {"text": "溫和耐心，善於傾聽。", "type": "S"},
            {"text": "謹慎準確，邏輯清晰。", "type": "C"}
        ]
    },
    {
        "id": 8,
        "question": "面對變化時，您的態度是？",
        "options": [
            {"text": "主動適應，尋找機會。", "type": "D"},
            {"text": "樂觀接受，積極配合。", "type": "I"},
            {"text": "謹慎觀望，逐步適應。", "type": "S"},
            {"text": "仔細評估，理性分析。", "type": "C"}
        ]
    },
    {
        "id": 9,
        "question": "您的工作風格是？",
        "options": [
            {"text": "目標導向，追求成果。", "type": "D"},
            {"text": "創意靈活，注重創新。", "type": "I"},
            {"text": "穩定持續，重視流程。", "type": "S"},
            {"text": "精確細致，追求完美。", "type": "C"}
        ]
    },
    {
        "id": 10,
        "question": "在衝突情況下，您會？",
        "options": [
            {"text": "直面問題，尋求解決方案。", "type": "D"},
            {"text": "協調溝通，化解矛盾。", "type": "I"},
            {"text": "避免衝突，維持和諧。", "type": "S"},
            {"text": "客觀分析，尋找根本原因。", "type": "C"}
        ]
    }
]

def calculate_disc_scores(answers):
    """計算DISC分數"""
    scores = {'D': 0, 'I': 0, 'S': 0, 'C': 0}
    
    for answer in answers.values():
        if 'type' in answer:
            scores[answer['type']] += 1
    
    return scores

def determine_personality_types(scores):
    """確定主要和次要人格類型"""
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    primary_type = sorted_scores[0][0]
    secondary_type = sorted_scores[1][0] if sorted_scores[1][1] > 0 else None
    
    return primary_type, secondary_type

@test_bp.route('/questions', methods=['GET'])
def get_questions():
    """獲取測驗問題"""
    return jsonify(DISC_QUESTIONS)

@test_bp.route('/submit', methods=['POST'])
def submit_test():
    """提交測驗結果"""
    try:
        data = request.json
        
        # 驗證必要字段
        required_fields = ['employee_id', 'name', 'email', 'answers']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # 計算DISC分數
        scores = calculate_disc_scores(data['answers'])
        primary_type, secondary_type = determine_personality_types(scores)
        
        # 創建測驗結果記錄
        test_result = TestResult(
            employee_id=data['employee_id'],
            name=data['name'],
            email=data['email'],
            d_score=scores['D'],
            i_score=scores['I'],
            s_score=scores['S'],
            c_score=scores['C'],
            primary_type=primary_type,
            secondary_type=secondary_type
        )
        test_result.set_answers(data['answers'])
        
        db.session.add(test_result)
        db.session.commit()
        
        # 返回結果
        result = {
            'id': test_result.id,
            'scores': scores,
            'primary_type': primary_type,
            'secondary_type': secondary_type,
            'analysis': {
                'scores': scores,
                'primary_type': primary_type,
                'secondary_type': secondary_type
            }
        }
        
        return jsonify(result), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@test_bp.route('/results', methods=['GET'])
def get_test_results():
    """獲取所有測驗結果（管理員功能）"""
    try:
        # 獲取查詢參數
        search = request.args.get('search', '')
        filter_type = request.args.get('type', 'all')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # 構建查詢
        query = TestResult.query
        
        # 搜索過濾
        if search:
            query = query.filter(
                (TestResult.name.contains(search)) |
                (TestResult.employee_id.contains(search)) |
                (TestResult.email.contains(search))
            )
        
        # 類型過濾
        if filter_type != 'all':
            query = query.filter(TestResult.primary_type == filter_type)
        
        # 分頁
        results = query.order_by(TestResult.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'results': [result.to_dict() for result in results.items],
            'total': results.total,
            'pages': results.pages,
            'current_page': page,
            'per_page': per_page
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/results/<int:result_id>', methods=['GET'])
def get_test_result(result_id):
    """獲取單個測驗結果"""
    try:
        result = TestResult.query.get_or_404(result_id)
        return jsonify(result.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/stats', methods=['GET'])
def get_statistics():
    """獲取統計數據"""
    try:
        total_tests = TestResult.query.count()
        
        # 各類型分布
        type_distribution = {}
        for type_char in ['D', 'I', 'S', 'C']:
            count = TestResult.query.filter(TestResult.primary_type == type_char).count()
            type_distribution[type_char] = count
        
        # 最近測驗
        recent_tests = TestResult.query.order_by(TestResult.created_at.desc()).limit(5).all()
        
        return jsonify({
            'total_tests': total_tests,
            'type_distribution': type_distribution,
            'recent_tests': [test.to_dict() for test in recent_tests]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/admin/login', methods=['POST'])
def admin_login():
    """管理員登錄"""
    try:
        data = request.json
        password = data.get('password', '')
        
        # 檢查數據庫中的密碼
        admin_settings = AdminSettings.query.first()
        
        if admin_settings and admin_settings.password_hash:
            # 如果數據庫中有密碼哈希，驗證密碼
            if check_password_hash(admin_settings.password_hash, password):
                return jsonify({'success': True, 'message': '登錄成功'})
            else:
                return jsonify({'success': False, 'message': '密碼錯誤'}), 401
        else:
            # 如果數據庫中沒有密碼設置，使用默認密碼
            if password == '123456':
                # 首次登錄時，將默認密碼存入數據庫
                if not admin_settings:
                    admin_settings = AdminSettings()
                    db.session.add(admin_settings)
                admin_settings.password_hash = generate_password_hash('123456')
                db.session.commit()
                return jsonify({'success': True, 'message': '登錄成功'})
            else:
                return jsonify({'success': False, 'message': '密碼錯誤'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/admin/change-password', methods=['POST'])
def change_admin_password():
    """變更管理員密碼"""
    try:
        data = request.json
        new_password = data.get('new_password', '')
        confirm_password = data.get('confirm_password', '')
        
        if new_password != confirm_password:
            return jsonify({'success': False, 'message': '密碼不匹配'}), 400
        
        if len(new_password) < 6:
            return jsonify({'success': False, 'message': '密碼長度不足6位'}), 400
        
        # 更新數據庫中的密碼
        admin_settings = AdminSettings.query.first()
        if not admin_settings:
            # 如果沒有設置記錄，創建一個新的
            admin_settings = AdminSettings()
            db.session.add(admin_settings)
        
        # 更新密碼哈希
        admin_settings.password_hash = generate_password_hash(new_password)
        admin_settings.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': '密碼變更成功'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@test_bp.route('/export', methods=['GET'])
def export_results():
    """匯出測驗結果"""
    try:
        # 獲取所有測驗結果
        results = TestResult.query.order_by(TestResult.created_at.desc()).all()
        
        # 轉換為CSV格式的數據
        csv_data = []
        csv_data.append(['姓名', '工號', '電子郵件', 'D分數', 'I分數', 'S分數', 'C分數', '主要類型', '次要類型', '測驗時間'])
        
        for result in results:
            csv_data.append([
                result.name,
                result.employee_id,
                result.email,
                result.d_score,
                result.i_score,
                result.s_score,
                result.c_score,
                result.primary_type,
                result.secondary_type or '',
                result.created_at.strftime('%Y-%m-%d %H:%M:%S') if result.created_at else ''
            ])
        
        return jsonify({
            'data': csv_data,
            'filename': f'disc_test_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@test_bp.route('/report/txt/<int:result_id>', methods=['GET'])
def generate_txt_report(result_id):
    """生成TXT格式的簡化報告"""
    try:
        result = TestResult.query.get_or_404(result_id)
        
        # 人格類型詳細信息
        personality_details = {
            'D': {
                'name': '掌控型 (Dominance)',
                'animal': '老虎',
                'description': '具有自信、果斷和目標導向的特質。喜歡掌控局勢，追求成就和成功。',
                'strengths': ['決斷力強', '自信心強', '目標導向', '領導能力', '勇於挑戰'],
                'challenges': ['過於競爭', '不善於妥協', '過於直接', '過度控制', '忽視細節'],
                'careers': ['管理職位', '企業家', '項目經理', '銷售主管', '執行長'],
                'work_style': '快速決策，追求效率，喜歡挑戰性工作，傾向於掌控全局',
                'development_suggestions': [
                    '學習傾聽他人意見，培養耐心',
                    '注重團隊合作，避免過度控制',
                    '關注細節，提升執行品質',
                    '發展同理心，改善人際關係'
                ]
            },
            'I': {
                'name': '影響型 (Influence)',
                'animal': '孔雀',
                'description': '心胸開放，強調人與人之間的關係互動，重視去影響或說服他人。',
                'strengths': ['社交能力強', '外向開朗', '溝通能力佳', '樂觀主義', '創意靈活'],
                'challenges': ['過度重視社交', '缺乏細節', '過度樂觀', '分散注意力', '依賴他人'],
                'careers': ['公關專員', '銷售代表', '培訓師', '市場營銷', '客戶服務'],
                'work_style': '重視創意，喜歡變化，善於團隊協作，注重人際關係',
                'development_suggestions': [
                    '提升專注力，避免分散注意力',
                    '加強細節管理和執行能力',
                    '培養獨立思考和決策能力',
                    '學習時間管理和優先級設定'
                ]
            },
            'S': {
                'name': '穩定型 (Steadiness)',
                'animal': '無尾熊',
                'description': '給人可靠的印象，溝通時強調合作和真誠。',
                'strengths': ['可靠穩定', '耐心細心', '團隊合作', '忠誠度高', '善於傾聽'],
                'challenges': ['抗拒變化', '決策緩慢', '避免衝突', '缺乏主動性', '過於保守'],
                'careers': ['人力資源', '客戶服務', '行政助理', '教師', '護理師'],
                'work_style': '按部就班，穩定執行，重視團隊和諧，喜歡穩定的環境',
                'development_suggestions': [
                    '提升適應變化的能力',
                    '培養主動性和領導技能',
                    '學習表達自己的觀點',
                    '增強決策速度和自信心'
                ]
            },
            'C': {
                'name': '分析型 (Conscientiousness)',
                'animal': '貓頭鷹',
                'description': '精確，有條理，注重細節。追求完美和準確性。',
                'strengths': ['注重細節', '分析能力強', '追求完美', '邏輯思維', '專業性強'],
                'challenges': ['過於謹慎', '完美主義', '決策緩慢', '抗拒變化', '缺乏靈活性'],
                'careers': ['會計師', '工程師', '研究員', '質量控制', '數據分析師'],
                'work_style': '注重細節，追求完美，喜歡有序的工作環境，重視準確性',
                'development_suggestions': [
                    '提升決策速度，避免過度分析',
                    '培養靈活性和適應能力',
                    '學習接受不完美，關注大局',
                    '增強溝通技巧和團隊協作'
                ]
            }
        }
        
        primary_personality = personality_details[result.primary_type]
        secondary_personality = personality_details.get(result.secondary_type, None)
        
        # 生成TXT報告內容
        report_content = []
        report_content.append("=" * 60)
        report_content.append("DISC四型人格測驗報告")
        report_content.append("=" * 60)
        report_content.append("")
        
        # 基本信息
        report_content.append("【基本信息】")
        report_content.append(f"姓名：{result.name}")
        report_content.append(f"工號：{result.employee_id}")
        report_content.append(f"電子郵件：{result.email}")
        report_content.append(f"測驗時間：{result.created_at.strftime('%Y年%m月%d日 %H:%M') if result.created_at else ''}")
        report_content.append("")
        
        # 測驗結果
        report_content.append("【測驗結果】")
        report_content.append(f"主要人格類型：{primary_personality['name']}")
        report_content.append(f"代表動物：{primary_personality['animal']}")
        if secondary_personality:
            report_content.append(f"次要人格類型：{secondary_personality['name']}")
        report_content.append("")
        
        # DISC分數分布
        report_content.append("【DISC分數分布】")
        report_content.append(f"D型 (掌控型)：{result.d_score} 分")
        report_content.append(f"I型 (影響型)：{result.i_score} 分")
        report_content.append(f"S型 (穩定型)：{result.s_score} 分")
        report_content.append(f"C型 (分析型)：{result.c_score} 分")
        report_content.append("")
        
        # 人格特質描述
        report_content.append("【人格特質描述】")
        report_content.append(primary_personality['description'])
        report_content.append("")
        
        # 優勢特質
        report_content.append("【您的優勢特質】")
        for i, strength in enumerate(primary_personality['strengths'], 1):
            report_content.append(f"{i}. {strength}")
        report_content.append("")
        
        # 需要注意的地方
        report_content.append("【需要注意的地方】")
        for i, challenge in enumerate(primary_personality['challenges'], 1):
            report_content.append(f"{i}. {challenge}")
        report_content.append("")
        
        # 適合的職業
        report_content.append("【適合的職業領域】")
        for i, career in enumerate(primary_personality['careers'], 1):
            report_content.append(f"{i}. {career}")
        report_content.append("")
        report_content.append(f"工作風格：{primary_personality['work_style']}")
        report_content.append("")
        
        # 發展建議
        report_content.append("【個人發展建議】")
        for i, suggestion in enumerate(primary_personality['development_suggestions'], 1):
            report_content.append(f"{i}. {suggestion}")
        report_content.append("")
        
        # 結語
        report_content.append("【結語】")
        report_content.append("DISC人格測驗是一個有效的自我認知工具，幫助您了解自己的行為風格和偏好。")
        report_content.append("請記住，沒有任何一種人格類型是完美的，每種類型都有其獨特的價值和貢獻。")
        report_content.append("重要的是要認識到自己的優勢，同時也要意識到需要改進的地方，持續學習和成長。")
        report_content.append("")
        report_content.append("建議您將這份報告作為個人發展的參考，並在日常工作和生活中實踐相關建議。")
        report_content.append("如有任何疑問，歡迎與我們聯繫。")
        report_content.append("")
        report_content.append("=" * 60)
        report_content.append("報告生成時間：" + datetime.now().strftime('%Y年%m月%d日 %H:%M:%S'))
        report_content.append("=" * 60)
        
        # 將內容合併為字符串
        txt_content = "\n".join(report_content)
        
        # 返回TXT內容
        from flask import Response
        import urllib.parse
        
        # 對文件名進行URL編碼以避免中文字符問題
        filename = f'DISC_Report_{result.employee_id}.txt'
        encoded_filename = urllib.parse.quote(filename.encode('utf-8'))
        
        return Response(
            txt_content,
            mimetype='text/plain; charset=utf-8',
            headers={
                'Content-Disposition': f'attachment; filename*=UTF-8\'\'{encoded_filename}',
                'Content-Type': 'text/plain; charset=utf-8'
            }
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

