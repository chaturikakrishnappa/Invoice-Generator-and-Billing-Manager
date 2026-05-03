import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    PORT = os.environ.get("PORT", 5000)
    # Remove localhost fallback, strictly use the environment variable
    MONGO_URI = os.environ.get("MONGO_URI")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "fallback_secret_key_for_dev")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    DEBUG = True
