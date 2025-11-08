"""Tests for analytics endpoints."""
from datetime import date


def test_get_summary(client, auth_headers):
    """Test getting expense summary."""
    # Create some expenses
    amounts = [10.0, 20.0, 30.0, 40.0]
    for amount in amounts:
        client.post('/api/expenses',
            headers=auth_headers,
            json={
                'amount': amount,
                'category': 'Food',
                'description': 'Test expense',
                'date': date.today().isoformat()
            }
        )
    
    response = client.get('/api/analytics/summary', headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json
    assert data['total'] == 100.0
    assert data['count'] == 4
    assert data['average'] == 25.0
    assert data['min'] == 10.0
    assert data['max'] == 40.0


def test_get_by_category(client, auth_headers):
    """Test getting expenses grouped by category."""
    # Create expenses in different categories
    expenses = [
        {'amount': 20.0, 'category': 'Food'},
        {'amount': 30.0, 'category': 'Food'},
        {'amount': 50.0, 'category': 'Transportation'},
    ]
    
    for exp in expenses:
        client.post('/api/expenses',
            headers=auth_headers,
            json={
                **exp,
                'description': 'Test',
                'date': date.today().isoformat()
            }
        )
    
    response = client.get('/api/analytics/by-category', headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json
    assert len(data['categories']) == 2
    
    # Find Food category
    food_cat = next(c for c in data['categories'] if c['category'] == 'Food')
    assert food_cat['total'] == 50.0
    assert food_cat['count'] == 2


def test_get_by_month(client, auth_headers):
    """Test getting expenses grouped by month."""
    # Create an expense
    client.post('/api/expenses',
        headers=auth_headers,
        json={
            'amount': 100.0,
            'category': 'Shopping',
            'description': 'Test',
            'date': date.today().isoformat()
        }
    )
    
    response = client.get('/api/analytics/by-month', headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json
    assert 'year' in data
    assert 'months' in data
    assert len(data['months']) >= 1


def test_get_trends(client, auth_headers):
    """Test getting expense trends."""
    # Create an expense
    client.post('/api/expenses',
        headers=auth_headers,
        json={
            'amount': 50.0,
            'category': 'Food',
            'description': 'Test',
            'date': date.today().isoformat()
        }
    )
    
    response = client.get('/api/analytics/trends?days=7', headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json
    assert 'start_date' in data
    assert 'end_date' in data
    assert 'trends' in data


def test_get_top_expenses(client, auth_headers):
    """Test getting top expenses."""
    amounts = [100.0, 50.0, 75.0, 25.0]
    for amount in amounts:
        client.post('/api/expenses',
            headers=auth_headers,
            json={
                'amount': amount,
                'category': 'Food',
                'description': f'Expense {amount}',
                'date': date.today().isoformat()
            }
        )
    
    response = client.get('/api/analytics/top-expenses?limit=3', headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json
    assert len(data['top_expenses']) == 3
    # First should be highest
    assert data['top_expenses'][0]['amount'] == 100.0


def test_summary_empty(client, auth_headers):
    """Test getting summary with no expenses."""
    response = client.get('/api/analytics/summary', headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json
    assert data['total'] == 0
    assert data['count'] == 0
    assert data['average'] == 0
