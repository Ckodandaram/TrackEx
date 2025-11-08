# TrackEx Mobile App

React Native mobile application for TrackEx expense tracking.

## Features

- User authentication
- Expense tracking with offline support
- Dashboard with analytics
- Push notifications for reminders
- Cross-platform (iOS & Android)

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)
- Backend API running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Update the API URL in `src/services/api.js`:
```javascript
const API_URL = 'YOUR_BACKEND_URL/api';
```

### Running the App

Start Expo development server:
```bash
npm start
```

Run on iOS:
```bash
npm run ios
```

Run on Android:
```bash
npm run android
```

Run on web (experimental):
```bash
npm run web
```

## Features Implemented

- ✅ Authentication (Login/Register)
- ✅ Dashboard with expense statistics
- ✅ Expense management
- ✅ Offline mode for adding expenses
- ✅ Push notifications support
- ✅ Story (budget) management
- ✅ Analytics and insights

## Project Structure

```
mobile/
├── src/
│   ├── screens/       # Screen components
│   ├── components/    # Reusable components
│   ├── services/      # API and business logic
│   ├── context/       # React context providers
│   └── utils/         # Utility functions
├── assets/            # Images and static files
├── App.js            # Root component
└── app.json          # Expo configuration
```

## Technologies

- React Native
- Expo
- React Navigation
- React Native Paper (UI components)
- Axios for API calls
- AsyncStorage for local data
- Expo Notifications
