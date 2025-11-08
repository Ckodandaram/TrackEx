"""Tests for authentication endpoints."""
import json


def test_register_user(client):
    """Test user registration."""
    response = client.post('/api/auth/register', json={
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'password123'
    })
    
    assert response.status_code == 201
    data = response.json
    assert data['message'] == 'User registered successfully'
    assert 'user' in data
    assert data['user']['username'] == 'newuser'


def test_register_duplicate_username(client):
    """Test registration with duplicate username."""
    client.post('/api/auth/register', json={
        'username': 'duplicate',
        'email': 'user1@example.com',
        'password': 'password123'
    })
    
    response = client.post('/api/auth/register', json={
        'username': 'duplicate',
        'email': 'user2@example.com',
        'password': 'password123'
    })
    
    assert response.status_code == 400
    assert 'Username already exists' in response.json['error']


def test_login_success(client):
    """Test successful login."""
    client.post('/api/auth/register', json={
        'username': 'loginuser',
        'email': 'login@example.com',
        'password': 'password123'
    })
    
    response = client.post('/api/auth/login', json={
        'username': 'loginuser',
        'password': 'password123'
    })
    
    assert response.status_code == 200
    data = response.json
    assert 'access_token' in data
    assert data['message'] == 'Login successful'


def test_login_invalid_credentials(client):
    """Test login with invalid credentials."""
    response = client.post('/api/auth/login', json={
        'username': 'nonexistent',
        'password': 'wrongpass'
    })
    
    assert response.status_code == 401
    assert 'Invalid username or password' in response.json['error']


def test_get_current_user(client, auth_headers):
    """Test getting current user information."""
    response = client.get('/api/auth/me', headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json
    assert 'user' in data
    assert data['user']['username'] == 'testuser'


def test_get_current_user_unauthorized(client):
    """Test getting user without authentication."""
    response = client.get('/api/auth/me')
    
    assert response.status_code == 401
