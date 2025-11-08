# Quick Start Guide - TrackEx

This guide will help you get TrackEx up and running quickly.

## Prerequisites

- Node.js v14+ installed
- MongoDB Atlas account (free tier is sufficient)
- For mobile: Expo Go app on your phone or iOS Simulator/Android Emulator

## Step 1: Backend Setup (5 minutes)

1. Open terminal in the `backend` directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create your MongoDB Atlas database:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Edit `.env` file and add your credentials:
```
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/trackex?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

6. Start the backend server:
```bash
npm run dev
```

✅ Backend should now be running on http://localhost:5000

Test it: Open http://localhost:5000 in your browser - you should see `{"message":"TrackEx API is running"}`

## Step 2: Frontend Setup (3 minutes)

1. Open a NEW terminal in the `frontend` directory:
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

4. The default settings should work:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the frontend:
```bash
npm start
```

✅ Frontend should open automatically at http://localhost:3000

## Step 3: Test the Application

1. On the login page, click "Register"
2. Create a new account with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123

3. After registration, you'll be redirected to the dashboard

4. Try adding an expense:
   - Go to "Expenses" page
   - Click "Add Expense"
   - Fill in the details and save

5. Check the dashboard to see analytics!

## Step 4: Mobile App Setup (Optional, 5 minutes)

1. Install Expo CLI globally (if not already installed):
```bash
npm install -g expo-cli
```

2. Open a NEW terminal in the `mobile` directory:
```bash
cd mobile
```

3. Install dependencies:
```bash
npm install
```

4. Update the API URL in `src/services/api.js`:
   - Replace `localhost` with your computer's IP address
   - Example: `http://192.168.1.100:5000/api`
   - To find your IP:
     - Mac/Linux: `ifconfig | grep inet`
     - Windows: `ipconfig`

5. Start Expo:
```bash
npm start
```

6. Install "Expo Go" app on your phone
7. Scan the QR code shown in terminal

✅ App should load on your phone!

## Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Ensure no other app is using port 5000
- Check Node.js version: `node --version` (should be 14+)

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `.env` file has correct API URL
- Check browser console for errors

### Mobile app can't connect
- Use IP address instead of localhost
- Ensure phone and computer are on same WiFi
- Check firewall isn't blocking port 5000

## What's Next?

- Explore all features: Expenses, Stories, Analytics
- Add multiple expenses to see charts populate
- Create a Story (budget) and link expenses to it
- Try the Profile page to change theme preferences
- Check out the analytics to see spending insights

## Default Data

The app starts with no data. You'll need to:
1. Register a user
2. Add some expenses
3. (Optional) Create stories to track budgets

## Support

For issues or questions:
- Check the main README.md
- Review individual README files in backend/, frontend/, mobile/
- Check API documentation in API_DOCUMENTATION.md

Enjoy tracking your expenses with TrackEx! 🎉
