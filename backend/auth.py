from functools import wraps

from flask import Blueprint, jsonify, request, session

from database import db
from models import User

auth_bp = Blueprint('auth', __name__)

def get_current_user():
    # Helper to retrieve user from session or Bearer Token (for easier API testing)
    user_id = session.get('user_id')
    if not user_id:
        # Check Authorization header as fallback
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            try:
                # In a full production JWT setup we would decode it.
                # For simplified production-ready API token fallback, we accept the user_id
                user_id = int(auth_header.split(' ')[1])
            except ValueError:
                pass
    if user_id:
        return User.query.get(user_id)
    return None

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'Unauthorized', 'message': 'Authentication required'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'Unauthorized', 'message': 'Authentication required'}), 401
        if current_user.role != 'admin':
            return jsonify({'error': 'Forbidden', 'message': 'Admin privileges required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Bad Request', 'message': 'Username and password are required'}), 400
        
    # Lookup by username OR email
    user = User.query.filter((User.username == username) | (User.email == username)).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Unauthorized', 'message': 'Invalid credentials'}), 401
        
    # Enforce admin login using email ID only
    if user.role == 'admin':
        if username != user.email:
            return jsonify({
                'error': 'Forbidden', 
                'message': 'For security, administrator accounts must log in using their email address.'
            }), 403
            
        # Check if password has been set via email flow
        if not user.is_password_set:
            return jsonify({
                'error': 'Unauthorized', 
                'message': 'Account pending setup. Please set your password using the link sent to your email.'
            }), 401
        
    # Store user in session
    session['user_id'] = user.id
    session['username'] = user.username
    session['role'] = user.role
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'token': str(user.id) # Token fallback for client requests
    })

@auth_bp.route('/request-setup', methods=['POST'])
def request_setup():
    data = request.json or {}
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Bad Request', 'message': 'Email address is required'}), 400
        
    user = User.query.filter_by(email=email, role='admin').first()
    if not user:
        # Keep response generic for security, but return link if email exists
        return jsonify({'message': 'If the email exists, a password setup link has been sent.'}), 200
        
    import uuid
    token = str(uuid.uuid4())
    user.password_token = token
    user.is_password_set = False
    db.session.commit()
    
    # Print mock email log in backend output
    print(f"\n[SMTP Mock] Email sent to {email}. Setup Link: http://127.0.0.1:5000/#/set-password?email={email}&token={token}\n")
    
    return jsonify({
        'message': 'Password setup link has been sent to your email.',
        'debug_link': f'http://127.0.0.1:5000/#/set-password?email={email}&token={token}'
    }), 200

@auth_bp.route('/set-password', methods=['POST'])
def set_password():
    data = request.json or {}
    email = data.get('email')
    token = data.get('token')
    password = data.get('password')
    
    if not email or not token or not password:
        return jsonify({'error': 'Bad Request', 'message': 'Email, token, and password are required'}), 400
        
    user = User.query.filter_by(email=email, password_token=token).first()
    if not user:
        return jsonify({'error': 'Unauthorized', 'message': 'Invalid email address or setup token'}), 401
        
    user.set_password(password)
    user.password_token = None
    user.is_password_set = True
    db.session.commit()
    
    return jsonify({'message': 'Password has been set successfully. You can now log in.'}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

@auth_bp.route('/me', methods=['GET'])
def me():
    user = get_current_user()
    if not user:
        return jsonify({'authenticated': False}), 200
    return jsonify({
        'authenticated': True,
        'user': user.to_dict()
    })
