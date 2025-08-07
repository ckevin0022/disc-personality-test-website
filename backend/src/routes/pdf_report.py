from flask import Blueprint, jsonify, request, send_file
from src.models.test_result import TestResult
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
import tempfile
from datetime import datetime
import io

pdf_bp = Blueprint('pdf', __name__)

# 註冊中文字體（使用系統默認字體）
try:
    # 嘗試使用系統中文字體
    font_paths = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
        '/System/Library/Fonts/Arial.ttf',  # macOS
        'C:/Windows/Fonts/arial.ttf'  # Windows
    ]
    
    font_registered = False
    for font_path in font_paths:
        if os.path.exists(font_path):
            try:
                pdfmetrics.registerFont(TTFont('CustomFont', font_path))
                font_registered = True
                break
            except:
                continue
    
    if not font_registered:
        # 如果沒有找到合適的字體，使用默認字體
        FONT_NAME = 'Helvetica'
    else:
        FONT_NAME = 'CustomFont'
except:
    FONT_NAME = 'Helvetica'

# 人格類型詳細信息
PERSONALITY_DETAILS = {
    'D': {
        'name': 'Dominance (D-Type)',
        'animal': 'Tiger',
        'description': 'Confident, decisive, and goal-oriented. Likes to control situations and pursue achievements.',
        'strengths': ['Strong decision-making', 'High confidence', 'Goal-oriented', 'Leadership ability', 'Embraces challenges'],
        'challenges': ['Overly competitive', 'Poor at compromise', 'Too direct', 'Over-controlling', 'Ignores details'],
        'careers': ['Management positions', 'Entrepreneur', 'Project manager', 'Sales director', 'CEO'],
        'work_style': 'Quick decision-making, efficiency-focused, likes challenging work, tends to control the overall situation',
        'development_suggestions': [
            'Learn to listen to others and develop patience',
            'Focus on teamwork and avoid over-controlling',
            'Pay attention to details and improve execution quality',
            'Develop empathy and improve interpersonal relationships'
        ]
    },
    'I': {
        'name': 'Influence (I-Type)',
        'animal': 'Peacock',
        'description': 'Open-minded, emphasizes interpersonal relationships, values influencing or persuading others.',
        'strengths': ['Strong social skills', 'Outgoing and cheerful', 'Good communication', 'Optimistic', 'Creative and flexible'],
        'challenges': ['Over-emphasis on socializing', 'Lacks attention to detail', 'Overly optimistic', 'Scattered attention', 'Dependent on others'],
        'careers': ['PR specialist', 'Sales representative', 'Trainer', 'Marketing', 'Customer service'],
        'work_style': 'Values creativity, likes change, good at teamwork, focuses on interpersonal relationships',
        'development_suggestions': [
            'Improve focus and avoid scattered attention',
            'Strengthen detail management and execution abilities',
            'Develop independent thinking and decision-making skills',
            'Learn time management and priority setting'
        ]
    },
    'S': {
        'name': 'Steadiness (S-Type)',
        'animal': 'Koala',
        'description': 'Gives a reliable impression, emphasizes cooperation and sincerity in communication.',
        'strengths': ['Reliable and stable', 'Patient and careful', 'Team cooperation', 'High loyalty', 'Good listener'],
        'challenges': ['Resists change', 'Slow decision-making', 'Avoids conflict', 'Lacks initiative', 'Too conservative'],
        'careers': ['Human resources', 'Customer service', 'Administrative assistant', 'Teacher', 'Nurse'],
        'work_style': 'Step-by-step approach, stable execution, values team harmony, prefers stable environment',
        'development_suggestions': [
            'Improve adaptability to change',
            'Develop initiative and leadership skills',
            'Learn to express your own views',
            'Enhance decision-making speed and confidence'
        ]
    },
    'C': {
        'name': 'Conscientiousness (C-Type)',
        'animal': 'Owl',
        'description': 'Precise, organized, detail-oriented. Pursues perfection and accuracy.',
        'strengths': ['Detail-oriented', 'Strong analytical ability', 'Pursues perfection', 'Logical thinking', 'High professionalism'],
        'challenges': ['Overly cautious', 'Perfectionist', 'Slow decision-making', 'Resists change', 'Lacks flexibility'],
        'careers': ['Accountant', 'Engineer', 'Researcher', 'Quality control', 'Data analyst'],
        'work_style': 'Detail-focused, pursues perfection, prefers orderly work environment, values accuracy',
        'development_suggestions': [
            'Improve decision-making speed, avoid over-analysis',
            'Develop flexibility and adaptability',
            'Learn to accept imperfection and focus on the big picture',
            'Enhance communication skills and teamwork'
        ]
    }
}

def create_pdf_report(test_result):
    """創建PDF報告"""
    # 創建臨時文件
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    temp_filename = temp_file.name
    temp_file.close()
    
    # 創建PDF文檔
    doc = SimpleDocTemplate(temp_filename, pagesize=A4)
    story = []
    
    # 獲取樣式
    styles = getSampleStyleSheet()
    
    # 自定義樣式
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1e40af'),
        fontName=FONT_NAME
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        spaceBefore=20,
        textColor=colors.HexColor('#1e40af'),
        fontName=FONT_NAME
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=6,
        leading=16,
        fontName=FONT_NAME
    )
    
    # 標題
    story.append(Paragraph("DISC Personality Test Report", title_style))
    story.append(Spacer(1, 20))
    
    # 基本信息
    story.append(Paragraph("Basic Information", heading_style))
    
    basic_info_data = [
        ['Name', test_result.name],
        ['Employee ID', test_result.employee_id],
        ['Email', test_result.email],
        ['Test Date', test_result.created_at.strftime('%Y-%m-%d %H:%M') if test_result.created_at else '']
    ]
    
    basic_info_table = Table(basic_info_data, colWidths=[2*inch, 4*inch])
    basic_info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f1f5f9')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), FONT_NAME),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0'))
    ]))
    
    story.append(basic_info_table)
    story.append(Spacer(1, 20))
    
    # 測驗結果
    story.append(Paragraph("Test Results", heading_style))
    
    primary_personality = PERSONALITY_DETAILS[test_result.primary_type]
    secondary_personality = PERSONALITY_DETAILS.get(test_result.secondary_type, None)
    
    # 主要人格類型
    story.append(Paragraph(f"Primary Personality Type: {primary_personality['name']}", normal_style))
    story.append(Paragraph(f"Representative Animal: {primary_personality['animal']}", normal_style))
    if secondary_personality:
        story.append(Paragraph(f"Secondary Personality Type: {secondary_personality['name']}", normal_style))
    story.append(Spacer(1, 10))
    
    # DISC分數表
    story.append(Paragraph("DISC Score Distribution", heading_style))
    
    score_data = [
        ['Type', 'Score', 'Description'],
        ['D-Type (Dominance)', str(test_result.d_score), 'Decisive, confident, goal-oriented'],
        ['I-Type (Influence)', str(test_result.i_score), 'Outgoing, optimistic, good at communication'],
        ['S-Type (Steadiness)', str(test_result.s_score), 'Stable, reliable, team cooperation'],
        ['C-Type (Conscientiousness)', str(test_result.c_score), 'Cautious, precise, detail-oriented']
    ]
    
    score_table = Table(score_data, colWidths=[1.8*inch, 1*inch, 3.2*inch])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), FONT_NAME),
        ('FONTNAME', (0, 1), (-1, -1), FONT_NAME),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    
    story.append(score_table)
    story.append(Spacer(1, 20))
    
    # 人格特質描述
    story.append(Paragraph("Personality Description", heading_style))
    story.append(Paragraph(primary_personality['description'], normal_style))
    story.append(Spacer(1, 15))
    
    # 優勢特質
    story.append(Paragraph("Your Strengths", heading_style))
    for strength in primary_personality['strengths']:
        story.append(Paragraph(f"• {strength}", normal_style))
    story.append(Spacer(1, 15))
    
    # 需要注意的地方
    story.append(Paragraph("Areas for Attention", heading_style))
    for challenge in primary_personality['challenges']:
        story.append(Paragraph(f"• {challenge}", normal_style))
    story.append(Spacer(1, 15))
    
    # 適合的職業
    story.append(Paragraph("Suitable Career Fields", heading_style))
    for career in primary_personality['careers']:
        story.append(Paragraph(f"• {career}", normal_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(f"Work Style: {primary_personality['work_style']}", normal_style))
    story.append(Spacer(1, 15))
    
    # 發展建議
    story.append(Paragraph("Development Suggestions", heading_style))
    for suggestion in primary_personality['development_suggestions']:
        story.append(Paragraph(f"• {suggestion}", normal_style))
    story.append(Spacer(1, 20))
    
    # 結語
    story.append(Paragraph("Conclusion", heading_style))
    conclusion_text = """
    The DISC personality test is an effective self-awareness tool that helps you understand your behavioral style and preferences.
    Remember that no personality type is perfect, and each type has its unique value and contribution.
    The key is to recognize your strengths while being aware of areas that need improvement, and to continue learning and growing.
    
    We recommend using this report as a reference for personal development and practicing the relevant suggestions in your daily work and life.
    If you have any questions, please feel free to contact us.
    """
    story.append(Paragraph(conclusion_text, normal_style))
    
    # 生成PDF
    doc.build(story)
    
    return temp_filename

@pdf_bp.route('/generate/<int:result_id>', methods=['GET'])
def generate_pdf_report(result_id):
    """生成PDF報告"""
    try:
        # 獲取測驗結果
        test_result = TestResult.query.get_or_404(result_id)
        
        # 生成PDF
        pdf_filename = create_pdf_report(test_result)
        
        # 設置下載文件名
        download_filename = f"DISC測驗報告_{test_result.name}_{datetime.now().strftime('%Y%m%d')}.pdf"
        
        # 返回PDF文件
        return send_file(
            pdf_filename,
            as_attachment=True,
            download_name=download_filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # 清理臨時文件
        try:
            if 'pdf_filename' in locals():
                os.unlink(pdf_filename)
        except:
            pass

@pdf_bp.route('/preview/<int:result_id>', methods=['GET'])
def preview_pdf_report(result_id):
    """預覽PDF報告（返回PDF內容）"""
    try:
        # 獲取測驗結果
        test_result = TestResult.query.get_or_404(result_id)
        
        # 生成PDF
        pdf_filename = create_pdf_report(test_result)
        
        # 讀取PDF內容
        with open(pdf_filename, 'rb') as f:
            pdf_content = f.read()
        
        # 清理臨時文件
        os.unlink(pdf_filename)
        
        # 返回PDF內容
        return send_file(
            io.BytesIO(pdf_content),
            mimetype='application/pdf',
            as_attachment=False
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

