# TrackEx - Expense Tracking Application

A full-stack expense tracking application with backend API, React web frontend, and React Native mobile app.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- **Authentication**: JWT-based authentication with bcrypt password encryption
- **Expense Management**: Full CRUD operations with filtering by category and date
- **Stories**: Budget tracking feature to group expenses and monitor spending against budget
- **Analytics**: Category-wise, weekly, monthly, and yearly expense reports
- **Dashboard**: Real-time insights and spending patterns

### Frontend (React.js)
- User authentication (Login/Register)
- Interactive dashboard with charts (Pie, Bar charts)
- Expense management with filters
- Budget stories with linked expenses
- Profile management with theme preferences
- Responsive design

### Mobile App (React Native + Expo)
- Cross-platform (iOS & Android)
- All web features available on mobile
- **Push Notifications**: Daily expense reminders and budget alerts
- **Offline Mode**: Add expenses without internet connection and sync later
- Native mobile UI with React Native Paper

## 📁 Project Structure

```
TrackEx/
├── backend/           # Node.js + Express API
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Auth middleware
│   ├── config/        # Database config
│   └── server.js      # Entry point
│
├── frontend/          # React.js web app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── context/     # Context providers
│   └── public/
│
└── mobile/            # React Native app
    ├── src/
    │   ├── screens/     # Screen components
    │   ├── services/    # API & offline services
    │   └── context/     # Auth context
    └── App.js
```

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB Atlas connection string and JWT secret:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `src/services/api.js`

4. Start Expo:
```bash
npm start
```

5. Use Expo Go app on your phone or run on emulator

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Stories
- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get story details with analytics
- `POST /api/stories` - Create story
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story

### Analytics
- `GET /api/analytics/dashboard` - Dashboard overview
- `GET /api/analytics/by-category` - Category-wise expenses
- `GET /api/analytics/weekly` - Weekly expenses
- `GET /api/analytics/monthly` - Monthly expenses
- `GET /api/analytics/yearly` - Yearly expenses
- `GET /api/analytics/by-payment-mode` - Payment mode distribution

## 🔧 Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt.js for password hashing

### Frontend
- React.js 18
- React Router DOM
- Axios
- Recharts for data visualization
- Context API for state management

### Mobile
- React Native
- Expo
- React Navigation
- React Native Paper
- Expo Notifications
- AsyncStorage for offline support

## 📱 Key Features

### 1. Expense Categories
- Food, Transportation, Shopping, Entertainment, Healthcare, Education, Bills, Travel, Other

### 2. Payment Modes
- Cash, Credit Card, Debit Card, UPI, Net Banking, Other

### 3. Stories (Budget Tracking)
- Create budgets with start/end dates
- Link expenses to stories
- View total spent vs budget
- Get insights on budget usage
- Visual progress indicators

### 4. Analytics & Insights
- Category-wise expense breakdown
- Monthly spending trends
- Yearly comparisons
- Payment mode analysis
- Smart insights (e.g., "You spent 20% more this month")

### 5. Mobile-Specific Features
- **Offline Mode**: Add expenses without internet, sync when online
- **Push Notifications**: Daily reminders and budget alerts
- **Native UI**: Optimized for mobile experience

## 🔐 Security

- Password encryption using bcrypt
- JWT token-based authentication
- Protected API routes with middleware
- Secure password reset (optional feature)

## 🚧 Future Enhancements

- Export data to CSV/PDF
- Recurring expense templates
- Multi-currency support
- Expense sharing between users
- Receipt image upload
- Advanced filtering and search
- Biometric authentication for mobile
- Dark mode support

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue in the repository.