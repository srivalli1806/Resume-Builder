from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///resume_builder.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resumes = db.relationship('Resume', backref='user', lazy=True)

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    template = db.Column(db.String(50), default='modern')
    data = db.Column(db.Text, nullable=False)  # JSON data
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/builder')
def builder():
    return render_template('builder.html')

@app.route('/templates')
def templates():
    return render_template('templates.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('builder'))
        else:
            flash('Invalid email or password', 'error')
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            flash('Email already registered', 'error')
            return render_template('signup.html')
        
        if User.query.filter_by(username=username).first():
            flash('Username already taken', 'error')
            return render_template('signup.html')
        
        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        flash('Account created successfully! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('signup.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # Here you would typically send an email or save to database
        flash('Thank you for your message! We will get back to you soon.', 'success')
        return redirect(url_for('contact'))
    
    return render_template('contact.html')

# API Routes for Resume Management
@app.route('/api/save-resume', methods=['POST'])
@login_required
def save_resume():
    try:
        data = request.get_json()
        title = data.get('title', 'Untitled Resume')
        template = data.get('template', 'modern')
        resume_data = json.dumps(data.get('data', {}))
        
        resume = Resume(
            user_id=current_user.id,
            title=title,
            template=template,
            data=resume_data
        )
        db.session.add(resume)
        db.session.commit()
        
        return jsonify({'success': True, 'id': resume.id})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/get-resumes')
@login_required
def get_resumes():
    resumes = Resume.query.filter_by(user_id=current_user.id).all()
    resume_list = []
    for resume in resumes:
        resume_list.append({
            'id': resume.id,
            'title': resume.title,
            'template': resume.template,
            'created_at': resume.created_at.strftime('%Y-%m-%d %H:%M'),
            'updated_at': resume.updated_at.strftime('%Y-%m-%d %H:%M')
        })
    return jsonify(resume_list)

@app.route('/api/get-resume/<int:resume_id>')
@login_required
def get_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
    if resume:
        return jsonify({
            'success': True,
            'data': json.loads(resume.data),
            'template': resume.template,
            'title': resume.title
        })
    return jsonify({'success': False, 'error': 'Resume not found'})

@app.route('/api/update-resume/<int:resume_id>', methods=['PUT'])
@login_required
def update_resume(resume_id):
    try:
        resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
        if not resume:
            return jsonify({'success': False, 'error': 'Resume not found'})
        
        data = request.get_json()
        resume.title = data.get('title', resume.title)
        resume.template = data.get('template', resume.template)
        resume.data = json.dumps(data.get('data', {}))
        resume.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/delete-resume/<int:resume_id>', methods=['DELETE'])
@login_required
def delete_resume(resume_id):
    try:
        resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
        if resume:
            db.session.delete(resume)
            db.session.commit()
            return jsonify({'success': True})
        return jsonify({'success': False, 'error': 'Resume not found'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Template data
@app.route('/api/templates')
def get_templates():
    templates = [
        {
            'id': 'modern',
            'name': 'Modern',
            'description': 'Clean, minimalist design with bold typography',
            'preview': '/static/images/templates/modern-preview.png'
        },
        {
            'id': 'classic',
            'name': 'Classic',
            'description': 'Traditional layout with professional styling',
            'preview': '/static/images/templates/classic-preview.png'
        },
        {
            'id': 'creative',
            'name': 'Creative',
            'description': 'Colorful and innovative design',
            'preview': '/static/images/templates/creative-preview.png'
        },
        {
            'id': 'professional',
            'name': 'Professional',
            'description': 'Corporate-style layout',
            'preview': '/static/images/templates/professional-preview.png'
        }
    ]
    return jsonify(templates)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001) 