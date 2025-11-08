# TrackEx - Personal Expense Tracking and Analytics Platform

A comprehensive web and mobile application designed to help users manage their finances efficiently. TrackEx allows users to record, analyze, and visualize their daily expenses through insightful data analytics.

## 📋 Project Overview

TrackEx is a full-stack application with separate frontend and backend components:

- **Backend**: Node.js/Express REST API with MongoDB
- **Frontend**: React Single Page Application with data visualization

## 🏗️ Project Structure

```
TrackEx/
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── index.js      # Main app entry
│   │   ├── config/       # Configuration files
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route handlers
│   │   └── middleware/   # Custom middleware
│   ├── package.json
│   └── README.md
│
├── ui/                    # React frontend
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── styles/       # CSS files
│   │   └── App.js        # Main app
│   ├── package.json
│   └── README.md
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote connection)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd ui
npm install
npm start
```

Frontend will open at `http://localhost:3000`

## 📚 Features

### Dashboard
- View total spending summary
- See total number of expenses
- Display recent expense list with details
- Quick overview of financial status

### Add Expense
- Record new expenses with category
- Support for multiple expense categories:
  - Food
  - Transport
  - Entertainment
  - Shopping
  - Bills
  - Health
  - Other
- Add optional descriptions
- Set custom date for expenses

### Analytics
- Pie chart visualization of expenses by category
- Bar chart showing monthly spending trends
- Interactive charts with detailed information
- Export-ready analytics data
- All amounts displayed in Indian Rupees (₹)

## 🔌 API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Authenticate user

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Analytics
- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/category` - Breakdown by category
- `GET /api/analytics/monthly` - Monthly trends

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: React Icons
- **Styling**: CSS

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.cao0fk4.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Note**: Replace `<db_username>` and `<db_password>` with your MongoDB Atlas credentials.

## 📝 Development

### Run Backend in Watch Mode
```bash
cd backend
npm run dev
```

### Run Frontend in Development Mode
```bash
cd ui
npm start
```

## 🧪 Testing

Backend tests:
```bash
cd backend
npm test
```

Frontend tests:
```bash
cd ui
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd ui
npm run build
```

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Commit with clear messages
4. Push to your branch
5. Create a pull request

## 📄 License

ISC

## 👤 Author

Ckodandaram

## 📞 Support

For issues and questions, please create an issue in the repository.