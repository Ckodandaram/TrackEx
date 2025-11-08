# TrackEx - Personal Expense Tracking and Analytics Platform

![TrackEx Banner](https://img.shields.io/badge/TrackEx-Expense%20Tracker-blueviolet)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green)

## Overview

TrackEx is a comprehensive web and mobile application designed to help users manage their finances efficiently. It allows users to record, analyze, and visualize their daily expenses through insightful data analytics. With an intuitive interface and powerful backend, TrackEx makes financial management simple and effective.

## Features

### 🎯 Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Expense Management**: Create, read, update, and delete expense records
- **Category Organization**: Organize expenses by customizable categories
- **Date Tracking**: Track expenses by date for temporal analysis

### 📊 Analytics & Visualization
- **Financial Summary**: View total expenses, average amounts, and transaction counts
- **Category Analysis**: Break down expenses by category with visual charts
- **Monthly Trends**: Analyze spending patterns over time
- **Top Expenses**: Identify your highest spending transactions
- **Custom Date Ranges**: Filter analytics by specific time periods

### 💻 User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dashboard View**: Quick overview of your financial status
- **Interactive Charts**: Visual representation of spending patterns
- **Real-time Updates**: Instant feedback on all operations

## Technology Stack

### Backend
- **Flask**: Python web framework for RESTful API
- **SQLAlchemy**: ORM for database operations
- **Flask-JWT-Extended**: JWT authentication
- **SQLite**: Lightweight database (easily replaceable with PostgreSQL/MySQL)

### Frontend
- **HTML5/CSS3**: Modern, responsive design
- **Vanilla JavaScript**: No framework dependencies, lightweight and fast
- **REST API Integration**: Clean separation of concerns

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ckodandaram/TrackEx.git
   cd TrackEx
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # On Linux/Mac
   source venv/bin/activate
   
   # On Windows
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables (optional)**
   ```bash
   export SECRET_KEY='your-secret-key'
   export JWT_SECRET_KEY='your-jwt-secret'
   export DATABASE_URL='sqlite:///trackex.db'
   ```

5. **Run the application**
   ```bash
   python run.py
   ```

6. **Access the application**
   Open your browser and navigate to: `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {...}
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Expense Endpoints

#### Get All Expenses
```
GET /api/expenses
Authorization: Bearer <token>

Optional Query Parameters:
- category: Filter by category
- start_date: Filter from date (ISO format)
- end_date: Filter to date (ISO format)
```

#### Create Expense
```
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 45.99,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2025-11-08"
}
```

#### Get Single Expense
```
GET /api/expenses/<id>
Authorization: Bearer <token>
```

#### Update Expense
```
PUT /api/expenses/<id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50.00,
  "category": "Food"
}
```

#### Delete Expense
```
DELETE /api/expenses/<id>
Authorization: Bearer <token>
```

#### Get Categories
```
GET /api/expenses/categories
Authorization: Bearer <token>
```

### Analytics Endpoints

#### Get Summary
```
GET /api/analytics/summary
Authorization: Bearer <token>

Optional Query Parameters:
- start_date: Filter from date
- end_date: Filter to date

Response:
{
  "total": 1234.56,
  "count": 45,
  "average": 27.43,
  "min": 5.00,
  "max": 200.00
}
```

#### Get Expenses by Category
```
GET /api/analytics/by-category
Authorization: Bearer <token>

Response:
{
  "categories": [
    {
      "category": "Food",
      "total": 456.78,
      "count": 23
    }
  ]
}
```

#### Get Expenses by Month
```
GET /api/analytics/by-month
Authorization: Bearer <token>

Optional Query Parameters:
- year: Year to analyze (default: current year)
```

#### Get Trends
```
GET /api/analytics/trends
Authorization: Bearer <token>

Optional Query Parameters:
- days: Number of days to analyze (default: 30)
```

#### Get Top Expenses
```
GET /api/analytics/top-expenses
Authorization: Bearer <token>

Optional Query Parameters:
- limit: Number of results (default: 10)
```

## Project Structure

```
TrackEx/
├── app/
│   ├── __init__.py           # Application factory
│   ├── models/
│   │   └── __init__.py       # Database models (User, Expense)
│   ├── routes/
│   │   ├── main.py           # Main routes (web interface)
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── expenses.py       # Expense management endpoints
│   │   └── analytics.py      # Analytics endpoints
│   ├── static/               # Static files (CSS, JS, images)
│   └── templates/
│       └── index.html        # Main web interface
├── config.py                 # Configuration settings
├── run.py                    # Application entry point
├── requirements.txt          # Python dependencies
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## Usage Guide

### Getting Started

1. **Register an Account**
   - Open the application in your browser
   - Click on "Register" tab
   - Fill in your username, email, and password
   - Click "Register"

2. **Login**
   - Enter your username and password
   - Click "Login"

3. **Add Your First Expense**
   - Navigate to the "Expenses" tab
   - Fill in the expense form:
     - Amount (e.g., 25.50)
     - Category (Food, Transportation, etc.)
     - Date
     - Description (optional)
   - Click "Add Expense"

4. **View Dashboard**
   - The Dashboard shows your financial overview
   - See total expenses, transaction count, and average expense
   - View recent expenses at a glance

5. **Analyze Your Spending**
   - Navigate to the "Analytics" tab
   - View detailed statistics
   - See expenses broken down by category
   - Identify spending patterns

## Development

### Running in Development Mode

The application runs in debug mode by default when using `run.py`. This enables:
- Auto-reload on code changes
- Detailed error messages
- Interactive debugger

### Database Schema

**Users Table**
- id: Integer (Primary Key)
- username: String (Unique)
- email: String (Unique)
- password_hash: String
- created_at: DateTime

**Expenses Table**
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key)
- amount: Float
- category: String
- description: String
- date: Date
- created_at: DateTime
- updated_at: DateTime

### Adding New Features

1. Create new models in `app/models/`
2. Add new routes in `app/routes/`
3. Register blueprints in `app/__init__.py`
4. Update frontend in `app/templates/`

## Security Features

- **Password Hashing**: Werkzeug security for password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Cross-origin resource sharing configured
- **SQL Injection Prevention**: SQLAlchemy ORM protects against SQL injection
- **XSS Protection**: Input sanitization and output encoding

## Deployment

### Production Configuration

1. Set environment variables:
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY='your-production-secret-key'
   export JWT_SECRET_KEY='your-production-jwt-secret'
   export DATABASE_URL='postgresql://user:pass@host/db'
   ```

2. Use a production-grade database (PostgreSQL recommended)

3. Deploy with a WSGI server (Gunicorn):
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 run:app
   ```

4. Use a reverse proxy (Nginx) for serving static files and SSL

### Deployment Platforms

TrackEx can be deployed to:
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Platform
- DigitalOcean
- Any VPS with Python support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Roadmap

Future enhancements planned:
- [ ] Export data to CSV/PDF
- [ ] Budget setting and alerts
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Receipt image upload
- [ ] Mobile native app (React Native)
- [ ] Email notifications
- [ ] Data backup and restore
- [ ] Advanced filtering and search
- [ ] Custom categories
- [ ] Expense sharing with family/groups

## Acknowledgments

- Flask framework and its extensions
- SQLAlchemy ORM
- The open-source community

---

**Made with ❤️ for better financial management**