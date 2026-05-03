from flask import request, jsonify, send_file
from flask_jwt_extended import get_jwt_identity
from models.db import get_db
from bson.objectid import ObjectId
from datetime import datetime
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
def generate_invoice_number(db, current_user_id):
    # simple sequence or random generator based on user
    count = db['invoices'].count_documents({"userId": current_user_id})
    return f"INV-{1000 + count + 1}"

def create_invoice():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    db = get_db()
    
    invoice_no = data.get('invoiceNo') or generate_invoice_number(db, current_user_id)
    
    new_invoice = {
        "userId": current_user_id,
        "invoiceNo": invoice_no,
        "clientId": data.get('clientId'),
        "clientName": data.get('clientName', ''),
        "clientEmail": data.get('clientEmail', ''),
        "clientPhone": data.get('clientPhone', ''),
        "items": data.get('items', []),
        "subtotal": data.get('subtotal', 0),
        "tax": data.get('tax', 0),
        "discount": data.get('discount', 0),
        "total": data.get('total', 0),
        "status": data.get('status', 'Unpaid'), # Unpaid, Paid, Overdue, Draft
        "issueDate": data.get('issueDate', datetime.utcnow().isoformat()),
        "dueDate": data.get('dueDate'),
        "notes": data.get('notes', ''),
        "createdAt": datetime.utcnow()
    }
    
    result = db['invoices'].insert_one(new_invoice)
    new_invoice['_id'] = str(result.inserted_id)
    
    return jsonify({"message": "Invoice created successfully", "invoice": new_invoice}), 201

def get_invoices():
    current_user_id = get_jwt_identity()
    db = get_db()
    
    invoices = list(db['invoices'].find({"userId": current_user_id}).sort("createdAt", -1))
    
    # Auto overdue check
    current_date = datetime.utcnow().isoformat()
    for inv in invoices:
        inv['_id'] = str(inv['_id'])
        if inv['status'] == 'Unpaid' and inv.get('dueDate') and inv['dueDate'] < current_date:
            inv['status'] = 'Overdue'
            db['invoices'].update_one({"_id": ObjectId(inv['_id'])}, {"$set": {"status": "Overdue"}})
            
    return jsonify({"invoices": invoices}), 200

def get_invoice(invoice_id):
    current_user_id = get_jwt_identity()
    db = get_db()
    
    try:
        invoice = db['invoices'].find_one({"_id": ObjectId(invoice_id), "userId": current_user_id})
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
            
        invoice['_id'] = str(invoice['_id'])
        return jsonify({"invoice": invoice}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def update_invoice(invoice_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    db = get_db()
    
    try:
        query = {"_id": ObjectId(invoice_id), "userId": current_user_id}
        update_data = {"$set": data}
        
        result = db['invoices'].update_one(query, update_data)
        
        if result.matched_count == 0:
            return jsonify({"error": "Invoice not found or unauthorized"}), 404
            
        return jsonify({"message": "Invoice updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def delete_invoice(invoice_id):
    current_user_id = get_jwt_identity()
    db = get_db()
    
    try:
        query = {"_id": ObjectId(invoice_id), "userId": current_user_id}
        result = db['invoices'].delete_one(query)
        
        if result.deleted_count == 0:
            return jsonify({"error": "Invoice not found or unauthorized"}), 404
            
        return jsonify({"message": "Invoice deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def download_invoice_pdf(invoice_id):
    current_user_id = get_jwt_identity()
    db = get_db()
    
    try:
        invoice = db['invoices'].find_one({"_id": ObjectId(invoice_id), "userId": current_user_id})
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
            
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        
        c.setFont("Helvetica-Bold", 24)
        c.drawString(50, 750, "INVOICE")
        
        c.setFont("Helvetica", 12)
        c.drawString(50, 720, f"Invoice No: {invoice.get('invoiceNo', '')}")
        c.drawString(50, 700, f"Status: {invoice.get('status', 'Unpaid')}")
        
        issue_date = invoice.get('issueDate', '')
        if 'T' in issue_date: issue_date = issue_date.split('T')[0]
        c.drawString(50, 680, f"Issue Date: {issue_date}")
        
        due_date = invoice.get('dueDate', '')
        if due_date:
            if 'T' in due_date: due_date = due_date.split('T')[0]
            c.drawString(50, 660, f"Due Date: {due_date}")
            
        c.drawString(300, 720, f"Billed To:")
        c.drawString(300, 700, f"{invoice.get('clientName', 'N/A')}")
        c.drawString(300, 680, f"{invoice.get('clientEmail', '')}")
        
        y = 600
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "Description")
        c.drawString(300, y, "Qty")
        c.drawString(400, y, "Price")
        c.drawString(500, y, "Total")
        
        c.setFont("Helvetica", 12)
        y -= 20
        for item in invoice.get('items', []):
            c.drawString(50, y, str(item.get('description', '')))
            c.drawString(300, y, str(item.get('quantity', 0)))
            c.drawString(400, y, f"{item.get('price', 0)}")
            c.drawString(500, y, f"{item.get('total', 0)}")
            y -= 20
            
        y -= 20
        c.setFont("Helvetica-Bold", 12)
        c.drawString(400, y, "Subtotal:")
        c.drawString(500, y, f"{invoice.get('subtotal', 0)}")
        y -= 20
        c.drawString(400, y, "Tax:")
        c.drawString(500, y, f"{invoice.get('tax', 0)}")
        y -= 20
        c.drawString(400, y, "Discount:")
        c.drawString(500, y, f"{invoice.get('discount', 0)}")
        y -= 20
        c.setFont("Helvetica-Bold", 14)
        c.drawString(400, y, "Total:")
        c.drawString(500, y, f"{invoice.get('total', 0)}")
        
        c.showPage()
        c.save()
        
        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"Invoice_{invoice.get('invoiceNo')}.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400
