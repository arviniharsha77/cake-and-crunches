import os

from flask import Flask, jsonify, render_template, send_from_directory
from flask_cors import CORS

from api import api_bp
from auth import auth_bp
from config import Config
from database import db

def create_app():
    # Set templates and static folder relative to the app.py location
    app = Flask(__name__, 
                template_folder=os.path.join(os.path.dirname(__file__), 'templates'),
                static_folder=os.path.join(os.path.dirname(__file__), 'static'))
    
    app.config.from_object(Config)
    
    # Enable CORS for API development
    CORS(app, supports_credentials=True)
    
    # Init DB
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Route for serving the frontend React SPA
    @app.route('/')
    def index():
        return render_template('index.html')
        
    # Route to catch all client-side React Router paths and serve index.html
    @app.route('/<path:path>')
    def catch_all(path):
        # Ignore API calls, let them 404 naturally
        if path.startswith('api/'):
            return jsonify({'error': 'Not Found', 'message': 'API endpoint not found'}), 404
            
        # Strip 'static/' prefix if present, as static_folder already points to the static directory
        file_path = path[7:] if path.startswith('static/') else path
            
        # Check if the requested file exists in static folder (e.g. css/style.css, js/app.js)
        if os.path.exists(os.path.join(app.static_folder, file_path)):
            return send_from_directory(app.static_folder, file_path)
            
        # Otherwise serve index.html for client-side routing
        return render_template('index.html')

    @app.after_request
    def add_header(response):
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response

    # Automatically create database tables within app context
    with app.app_context():
        db.create_all()
        try:
            from models import User
            if User.query.first() is None:
                print("Database is empty. Auto-seeding...")
                from seed import seed_db
                seed_db()
        except Exception as e:
            print(f"Failed to auto-seed database: {e}")
        
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='127.0.0.1', port=port, debug=True)
