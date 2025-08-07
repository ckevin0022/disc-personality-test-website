import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.models.test_result import TestResult, AdminSettings
from src.routes.user import user_bp
from src.routes.test import test_bp
# from src.routes.pdf_report import pdf_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# 啟用CORS支持
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(test_bp, url_prefix='/api/test')
# app.register_blueprint(pdf_bp, url_prefix='/api/pdf')

# 數據庫配置 - 支持Vercel環境
if os.environ.get('VERCEL'):
    # Vercel環境使用臨時數據庫
    db_path = '/tmp/app.db'
else:
    # 本地環境使用相對路徑
    db_path = os.path.join(os.path.dirname(__file__), 'database', 'app.db')

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# 確保數據庫目錄存在
if not os.environ.get('VERCEL'):
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # 如果是API請求，讓Flask處理
    if path.startswith('api/'):
        return "API Server Running", 200
    
    # 在Vercel環境中，靜態文件由前端構建處理
    if os.environ.get('VERCEL'):
        return "API Server Running", 200
    
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
