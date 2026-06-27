import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'cakes_and_crunches_secret_key_123!')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Database config: Check for MySQL env variables first, otherwise fallback to SQLite
    DB_USER = os.environ.get('DB_USER', 'root')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', '')
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT', '3306')
    DB_NAME = os.environ.get('DB_NAME', 'cakes_and_crunches')
    
    # Build connection string
    # If environment says use sqlite or no mysql configuration exists, fallback
    USE_SQLITE = os.environ.get('USE_SQLITE', 'true').lower() == 'true'
    
    if USE_SQLITE:
        if os.environ.get('VERCEL') == '1':
            SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/cakes_and_crunches.db'
        else:
            SQLALCHEMY_DATABASE_URI = 'sqlite:///cakes_and_crunches.db'
    else:
        SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
