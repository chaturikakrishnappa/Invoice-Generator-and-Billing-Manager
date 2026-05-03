from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.client_controller import create_client, get_clients, update_client, delete_client

client_bp = Blueprint('clients', __name__)

@client_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create():
    return create_client()

@client_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_all():
    return get_clients()

@client_bp.route('/<client_id>', methods=['PUT'])
@jwt_required()
def update(client_id):
    return update_client(client_id)

@client_bp.route('/<client_id>', methods=['DELETE'])
@jwt_required()
def delete(client_id):
    return delete_client(client_id)
