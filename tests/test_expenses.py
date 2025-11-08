"""Tests for expense management endpoints."""
from datetime import date


def test_create_expense(client, auth_headers):
    """Test creating a new expense."""
    response = client.post('/api/expenses', 
        headers=auth_headers,
        json={
            'amount': 25.50,
            'category': 'Food',
            'description': 'Lunch',
            'date': date.today().isoformat()
        }
    )
    
    assert response.status_code == 201
    data = response.json
    assert data['message'] == 'Expense created successfully'
    assert data['expense']['amount'] == 25.50
    assert data['expense']['category'] == 'Food'


def test_get_expenses(client, auth_headers):
    """Test getting all expenses."""
    # Create some expenses
    for i in range(3):
        client.post('/api/expenses',
            headers=auth_headers,
            json={
                'amount': 10.0 * (i + 1),
                'category': 'Food',
                'description': f'Expense {i}',
                'date': date.today().isoformat()
            }
        )
    
    response = client.get('/api/expenses', headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json
    assert data['count'] == 3
    assert len(data['expenses']) == 3


def test_get_single_expense(client, auth_headers):
    """Test getting a single expense."""
    # Create expense
    create_response = client.post('/api/expenses',
        headers=auth_headers,
        json={
            'amount': 50.0,
            'category': 'Shopping',
            'description': 'New shoes',
            'date': date.today().isoformat()
        }
    )
    
    expense_id = create_response.json['expense']['id']
    
    response = client.get(f'/api/expenses/{expense_id}', headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json
    assert data['expense']['amount'] == 50.0


def test_update_expense(client, auth_headers):
    """Test updating an expense."""
    # Create expense
    create_response = client.post('/api/expenses',
        headers=auth_headers,
        json={
            'amount': 30.0,
            'category': 'Food',
            'description': 'Dinner',
            'date': date.today().isoformat()
        }
    )
    
    expense_id = create_response.json['expense']['id']
    
    # Update expense
    response = client.put(f'/api/expenses/{expense_id}',
        headers=auth_headers,
        json={
            'amount': 35.0,
            'description': 'Updated dinner'
        }
    )
    
    assert response.status_code == 200
    data = response.json
    assert data['expense']['amount'] == 35.0
    assert data['expense']['description'] == 'Updated dinner'


def test_delete_expense(client, auth_headers):
    """Test deleting an expense."""
    # Create expense
    create_response = client.post('/api/expenses',
        headers=auth_headers,
        json={
            'amount': 20.0,
            'category': 'Entertainment',
            'description': 'Movie ticket',
            'date': date.today().isoformat()
        }
    )
    
    expense_id = create_response.json['expense']['id']
    
    # Delete expense
    response = client.delete(f'/api/expenses/{expense_id}', headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['message'] == 'Expense deleted successfully'
    
    # Verify deletion
    get_response = client.get(f'/api/expenses/{expense_id}', headers=auth_headers)
    assert get_response.status_code == 404


def test_get_categories(client, auth_headers):
    """Test getting unique categories."""
    # Create expenses with different categories
    categories = ['Food', 'Transportation', 'Entertainment']
    for cat in categories:
        client.post('/api/expenses',
            headers=auth_headers,
            json={
                'amount': 10.0,
                'category': cat,
                'description': f'{cat} expense',
                'date': date.today().isoformat()
            }
        )
    
    response = client.get('/api/expenses/categories', headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json
    assert len(data['categories']) == 3
    assert set(data['categories']) == set(categories)


def test_create_expense_unauthorized(client):
    """Test creating expense without authentication."""
    response = client.post('/api/expenses',
        json={
            'amount': 25.50,
            'category': 'Food',
            'date': date.today().isoformat()
        }
    )
    
    assert response.status_code == 401
