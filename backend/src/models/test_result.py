from src.models.user import db
from datetime import datetime
import json

class TestResult(db.Model):
    __tablename__ = 'test_results'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    
    # DISC分數
    d_score = db.Column(db.Integer, nullable=False, default=0)
    i_score = db.Column(db.Integer, nullable=False, default=0)
    s_score = db.Column(db.Integer, nullable=False, default=0)
    c_score = db.Column(db.Integer, nullable=False, default=0)
    
    # 主要和次要人格類型
    primary_type = db.Column(db.String(1), nullable=False)
    secondary_type = db.Column(db.String(1), nullable=True)
    
    # 測驗答案（JSON格式存儲）
    answers = db.Column(db.Text, nullable=False)
    
    # 時間戳
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<TestResult {self.name} - {self.primary_type}型>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'name': self.name,
            'email': self.email,
            'scores': {
                'D': self.d_score,
                'I': self.i_score,
                'S': self.s_score,
                'C': self.c_score
            },
            'primary_type': self.primary_type,
            'secondary_type': self.secondary_type,
            'answers': json.loads(self.answers) if self.answers else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def set_answers(self, answers_dict):
        """設置答案JSON"""
        self.answers = json.dumps(answers_dict)
    
    def get_answers(self):
        """獲取答案字典"""
        return json.loads(self.answers) if self.answers else {}

class AdminSettings(db.Model):
    __tablename__ = 'admin_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<AdminSettings {self.id}>'

