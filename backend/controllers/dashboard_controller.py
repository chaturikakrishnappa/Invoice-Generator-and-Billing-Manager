from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from models.db import get_db

def get_dashboard_stats():
    current_user_id = get_jwt_identity()
    db = get_db()
    
    invoices = list(db['invoices'].find({"userId": current_user_id}))
    clients_count = db['clients'].count_documents({"userId": current_user_id})
    
    total_revenue = 0
    paid_count = 0
    unpaid_count = 0
    overdue_count = 0
    
    monthly_revenue = {str(i): 0 for i in range(1, 13)}
    
    for inv in invoices:
        total = float(inv.get('total', 0))
        status = inv.get('status', 'Unpaid')
        
        if status == 'Paid':
            total_revenue += total
            paid_count += 1
            
            # Extract month for chart
            try:
                date_str = inv.get('issueDate')
                if date_str:
                    month = str(int(date_str.split('-')[1])) # assumes YYYY-MM-DD
                    monthly_revenue[month] += total
            except Exception:
                pass
                
        elif status == 'Unpaid':
            unpaid_count += 1
        elif status == 'Overdue':
            overdue_count += 1
            
    recent_invoices = invoices[-5:] # get last 5
    for inv in recent_invoices:
        inv['_id'] = str(inv['_id'])
        
    return jsonify({
        "stats": {
            "totalRevenue": total_revenue,
            "paidInvoices": paid_count,
            "unpaidInvoices": unpaid_count,
            "overdueInvoices": overdue_count,
            "totalClients": clients_count
        },
        "monthlyRevenue": [monthly_revenue[str(i)] for i in range(1, 13)],
        "recentInvoices": recent_invoices[::-1]
    }), 200
