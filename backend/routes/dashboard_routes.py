from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.dashboard_controller import get_dashboard_stats

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def stats():
    return get_dashboard_stats()
