# TrackEx Backend API

Backend API for TrackEx expense tracking application built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based authentication with bcrypt password encryption
- **Expense Management**: Full CRUD operations for expenses with filtering
- **Stories**: Budget tracking with linked expenses
- **Analytics**: Category-wise, weekly, monthly, and yearly expense reports
- **Dashboard**: Real-time insights and spending patterns

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Expenses
- `GET /api/expenses` - Get all expenses (Protected, supports filtering)
- `GET /api/expenses/:id` - Get single expense (Protected)
- `POST /api/expenses` - Create new expense (Protected)
- `PUT /api/expenses/:id` - Update expense (Protected)
- `DELETE /api/expenses/:id` - Delete expense (Protected)

### Stories
- `GET /api/stories` - Get all stories (Protected)
- `GET /api/stories/:id` - Get single story with analytics (Protected)
- `POST /api/stories` - Create new story (Protected)
- `PUT /api/stories/:id` - Update story (Protected)
- `DELETE /api/stories/:id` - Delete story (Protected)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard overview (Protected)
- `GET /api/analytics/by-category` - Get category-wise expenses (Protected)
- `GET /api/analytics/weekly` - Get weekly expenses (Protected)
- `GET /api/analytics/monthly` - Get monthly expenses (Protected)
- `GET /api/analytics/yearly` - Get yearly expenses (Protected)
- `GET /api/analytics/by-payment-mode` - Get payment mode distribution (Protected)

## Models

### User
- name, email, password (hashed), themeMode

### Expense
- user, story, amount, category, paymentMode, date, notes

### Story
- user, name, budget, startDate, endDate, description

## Categories
Food, Transportation, Shopping, Entertainment, Healthcare, Education, Bills, Travel, Other

## Payment Modes
Cash, Credit Card, Debit Card, UPI, Net Banking, Other
