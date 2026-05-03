from flask import request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity
from extensions import bcrypt
from models.db import get_db
from datetime import datetime

def register_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"error": "Name, email, and password are required"}), 400

    db = get_db()
    users_collection = db['users']

    if users_collection.find_one({"email": data['email']}):
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_password,
        "role": data.get('role', 'user'),
        "createdAt": datetime.utcnow()
    }

    result = users_collection.insert_one(new_user)
    
    # Generate token
    access_token = create_access_token(identity=str(result.inserted_id))
    
    return jsonify({
        "message": "User registered successfully",
        "token": access_token,
        "user": {
            "id": str(result.inserted_id),
            "name": new_user['name'],
            "email": new_user['email'],
            "role": new_user['role']
        }
    }), 201

def login_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    db = get_db()
    users_collection = db['users']

    user = users_collection.find_one({"email": data['email']})
    if not user or not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user['_id']))

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email'],
            "role": user.get('role', 'user')
        }
    }), 200

def get_profile():
    current_user_id = get_jwt_identity()
    db = get_db()
    from bson.objectid import ObjectId
    
    try:
        user = db['users'].find_one({"_id": ObjectId(current_user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({
            "user": {
                "id": str(user['_id']),
                "name": user['name'],
                "email": user['email'],
                "role": user.get('role', 'user'),
                "createdAt": user['createdAt'].isoformat() if 'createdAt' in user else None
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
