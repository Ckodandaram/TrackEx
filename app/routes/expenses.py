"""Expense management routes."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import db
from app.models import Expense

bp = Blueprint('expenses', __name__, url_prefix='/api/expenses')


@bp.route('', methods=['GET'])
@jwt_required()
def get_expenses():
    """Get all expenses for the current user."""
    user_id = get_jwt_identity()
    
    # Optional filters
    category = request.args.get('category')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Expense.query.filter_by(user_id=user_id)
    
    if category:
        query = query.filter_by(category=category)
    
    if start_date:
        query = query.filter(Expense.date >= datetime.fromisoformat(start_date).date())
    
    if end_date:
        query = query.filter(Expense.date <= datetime.fromisoformat(end_date).date())
    
    expenses = query.order_by(Expense.date.desc()).all()
    
    return jsonify({
        'expenses': [expense.to_dict() for expense in expenses],
        'count': len(expenses)
    }), 200


@bp.route('', methods=['POST'])
@jwt_required()
def create_expense():
    """Create a new expense."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('amount') or not data.get('category') or not data.get('date'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        expense = Expense(
            user_id=user_id,
            amount=float(data['amount']),
            category=data['category'],
            description=data.get('description', ''),
            date=datetime.fromisoformat(data['date']).date()
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify({
            'message': 'Expense created successfully',
            'expense': expense.to_dict()
        }), 201
    except ValueError:
        return jsonify({'error': 'Invalid data format'}), 400


@bp.route('/<int:expense_id>', methods=['GET'])
@jwt_required()
def get_expense(expense_id):
    """Get a specific expense."""
    user_id = get_jwt_identity()
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
    
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    
    return jsonify({'expense': expense.to_dict()}), 200


@bp.route('/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    """Update an existing expense."""
    user_id = get_jwt_identity()
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
    
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    
    data = request.get_json()
    
    try:
        if 'amount' in data:
            expense.amount = float(data['amount'])
        if 'category' in data:
            expense.category = data['category']
        if 'description' in data:
            expense.description = data['description']
        if 'date' in data:
            expense.date = datetime.fromisoformat(data['date']).date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Expense updated successfully',
            'expense': expense.to_dict()
        }), 200
    except ValueError:
        return jsonify({'error': 'Invalid data format'}), 400


@bp.route('/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    """Delete an expense."""
    user_id = get_jwt_identity()
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
    
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    
    db.session.delete(expense)
    db.session.commit()
    
    return jsonify({'message': 'Expense deleted successfully'}), 200


@bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Get all unique categories for the current user."""
    user_id = get_jwt_identity()
    
    categories = db.session.query(Expense.category)\
        .filter_by(user_id=user_id)\
        .distinct()\
        .all()
    
    return jsonify({
        'categories': [cat[0] for cat in categories]
    }), 200
