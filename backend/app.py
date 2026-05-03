import os
from dotenv import load_dotenv

# 1. Load environment variables using absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

mongo_uri = os.getenv("MONGO_URI")
print("Loaded Mongo URI:", mongo_uri)

from flask import Flask, jsonify
from flask_cors import CORS
from config.settings import Config
from models.db import init_db
from extensions import bcrypt, jwt
from routes.auth_routes import auth_bp
from routes.invoice_routes import invoice_bp
from routes.client_routes import client_bp
from routes.dashboard_routes import dashboard_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Initialize database
    init_db(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(invoice_bp, url_prefix='/api/invoices')
    app.register_blueprint(client_bp, url_prefix='/api/clients')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

    @app.route('/', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "message": "InvoicePro+ API is running."}), 200

    # Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)))
