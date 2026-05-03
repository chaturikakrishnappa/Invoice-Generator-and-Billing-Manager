from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from models.db import get_db
from bson.objectid import ObjectId
from datetime import datetime

def create_client():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('email'):
        return jsonify({"error": "Client name and email are required"}), 400

    db = get_db()
    clients_collection = db['clients']

    new_client = {
        "userId": current_user_id,
        "name": data['name'],
        "email": data['email'],
        "phone": data.get('phone', ''),
        "address": data.get('address', ''),
        "createdAt": datetime.utcnow()
    }

    result = clients_collection.insert_one(new_client)
    new_client['_id'] = str(result.inserted_id)
    
    return jsonify({"message": "Client created successfully", "client": new_client}), 201

def get_clients():
    current_user_id = get_jwt_identity()
    db = get_db()
    clients_collection = db['clients']
    
    clients = list(clients_collection.find({"userId": current_user_id}))
    for client in clients:
        client['_id'] = str(client['_id'])
        
    return jsonify({"clients": clients}), 200

def update_client(client_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    db = get_db()
    
    try:
        query = {"_id": ObjectId(client_id), "userId": current_user_id}
        update_data = {"$set": data}
        
        result = db['clients'].update_one(query, update_data)
        
        if result.matched_count == 0:
            return jsonify({"error": "Client not found or unauthorized"}), 404
            
        return jsonify({"message": "Client updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def delete_client(client_id):
    current_user_id = get_jwt_identity()
    db = get_db()
    
    try:
        query = {"_id": ObjectId(client_id), "userId": current_user_id}
        result = db['clients'].delete_one(query)
        
        if result.deleted_count == 0:
            return jsonify({"error": "Client not found or unauthorized"}), 404
            
        return jsonify({"message": "Client deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
