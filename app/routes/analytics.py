"""Analytics and reporting routes."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import func, extract
from app import db
from app.models import Expense

bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')


@bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    """Get expense summary statistics."""
    user_id = get_jwt_identity()
    
    # Optional date filters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Expense.query.filter_by(user_id=user_id)
    
    if start_date:
        query = query.filter(Expense.date >= datetime.fromisoformat(start_date).date())
    
    if end_date:
        query = query.filter(Expense.date <= datetime.fromisoformat(end_date).date())
    
    # Calculate statistics
    expenses = query.all()
    
    if not expenses:
        return jsonify({
            'total': 0,
            'count': 0,
            'average': 0,
            'min': 0,
            'max': 0
        }), 200
    
    amounts = [e.amount for e in expenses]
    
    return jsonify({
        'total': sum(amounts),
        'count': len(amounts),
        'average': sum(amounts) / len(amounts),
        'min': min(amounts),
        'max': max(amounts)
    }), 200


@bp.route('/by-category', methods=['GET'])
@jwt_required()
def get_by_category():
    """Get expenses grouped by category."""
    user_id = get_jwt_identity()
    
    # Optional date filters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = db.session.query(
        Expense.category,
        func.sum(Expense.amount).label('total'),
        func.count(Expense.id).label('count')
    ).filter_by(user_id=user_id)
    
    if start_date:
        query = query.filter(Expense.date >= datetime.fromisoformat(start_date).date())
    
    if end_date:
        query = query.filter(Expense.date <= datetime.fromisoformat(end_date).date())
    
    results = query.group_by(Expense.category).all()
    
    return jsonify({
        'categories': [
            {
                'category': r.category,
                'total': float(r.total),
                'count': r.count
            }
            for r in results
        ]
    }), 200


@bp.route('/by-month', methods=['GET'])
@jwt_required()
def get_by_month():
    """Get expenses grouped by month."""
    user_id = get_jwt_identity()
    
    # Optional year filter
    year = request.args.get('year', datetime.now().year, type=int)
    
    query = db.session.query(
        extract('month', Expense.date).label('month'),
        func.sum(Expense.amount).label('total'),
        func.count(Expense.id).label('count')
    ).filter_by(user_id=user_id)\
     .filter(extract('year', Expense.date) == year)
    
    results = query.group_by(extract('month', Expense.date)).all()
    
    return jsonify({
        'year': year,
        'months': [
            {
                'month': int(r.month),
                'total': float(r.total),
                'count': r.count
            }
            for r in results
        ]
    }), 200


@bp.route('/trends', methods=['GET'])
@jwt_required()
def get_trends():
    """Get expense trends over time."""
    user_id = get_jwt_identity()
    
    # Default to last 30 days
    days = request.args.get('days', 30, type=int)
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    query = db.session.query(
        Expense.date,
        func.sum(Expense.amount).label('total')
    ).filter_by(user_id=user_id)\
     .filter(Expense.date >= start_date)\
     .filter(Expense.date <= end_date)
    
    results = query.group_by(Expense.date).all()
    
    return jsonify({
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'trends': [
            {
                'date': r.date.isoformat(),
                'total': float(r.total)
            }
            for r in results
        ]
    }), 200


@bp.route('/top-expenses', methods=['GET'])
@jwt_required()
def get_top_expenses():
    """Get top expenses by amount."""
    user_id = get_jwt_identity()
    limit = request.args.get('limit', 10, type=int)
    
    expenses = Expense.query.filter_by(user_id=user_id)\
        .order_by(Expense.amount.desc())\
        .limit(limit)\
        .all()
    
    return jsonify({
        'top_expenses': [expense.to_dict() for expense in expenses]
    }), 200
