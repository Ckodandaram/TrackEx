# TrackEx Frontend

React.js frontend for TrackEx expense tracking application.

## Features

- User authentication (Login/Register)
- Expense management with filtering
- Budget stories with linked expenses
- Analytics dashboard with charts
- Profile management with theme preferences

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update the `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the App

Development mode:
```bash
npm start
```

Build for production:
```bash
npm run build
```

The app will run on `http://localhost:3000`

## Pages

- `/login` - User login
- `/register` - User registration
- `/dashboard` - Analytics dashboard with charts
- `/expenses` - Expense management (CRUD)
- `/stories` - Budget stories management
- `/profile` - User profile and settings

## Technologies

- React.js 18
- React Router DOM for routing
- Axios for API calls
- Recharts for data visualization
- Context API for state management
