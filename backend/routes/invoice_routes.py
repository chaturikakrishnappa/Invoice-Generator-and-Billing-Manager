from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.invoice_controller import (
    create_invoice, get_invoices, get_invoice, 
    update_invoice, delete_invoice, download_invoice_pdf
)

invoice_bp = Blueprint('invoices', __name__)

@invoice_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create():
    return create_invoice()

@invoice_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_all():
    return get_invoices()

@invoice_bp.route('/<invoice_id>', methods=['GET'])
@jwt_required()
def get_one(invoice_id):
    return get_invoice(invoice_id)

@invoice_bp.route('/<invoice_id>', methods=['PUT'])
@jwt_required()
def update(invoice_id):
    return update_invoice(invoice_id)

@invoice_bp.route('/<invoice_id>', methods=['DELETE'])
@jwt_required()
def delete(invoice_id):
    return delete_invoice(invoice_id)

@invoice_bp.route('/<invoice_id>/pdf', methods=['GET'])
@jwt_required()
def download_pdf(invoice_id):
    return download_invoice_pdf(invoice_id)
