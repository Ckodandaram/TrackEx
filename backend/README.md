# TrackEx Backend

Personal Expense Tracking and Analytics Platform - Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/analytics` - Get expense analytics

## Project Structure

```
src/
├── index.js           # Main application entry
├── config/            # Configuration files
├── models/            # Database models
├── routes/            # API routes
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
```
