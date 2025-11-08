# TrackEx API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "themeMode": "auto",
  "token": "jwt_token_here"
}
```

---

### Login User
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "themeMode": "auto",
  "token": "jwt_token_here"
}
```

---

### Get Current User
```
GET /auth/me
```
🔒 **Protected**

**Response:** `200 OK`
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "themeMode": "auto"
}
```

---

### Update Profile
```
PUT /auth/profile
```
🔒 **Protected**

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "themeMode": "dark",
  "password": "newpassword123"  // optional
}
```

**Response:** `200 OK`
```json
{
  "_id": "user_id",
  "name": "John Updated",
  "email": "john.new@example.com",
  "themeMode": "dark",
  "token": "new_jwt_token_here"
}
```

---

## Expense Endpoints

### Get All Expenses
```
GET /expenses?category=Food&startDate=2024-01-01&endDate=2024-12-31&story=story_id
```
🔒 **Protected**

**Query Parameters:**
- `category` (optional): Filter by category
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)
- `story` (optional): Filter by story ID

**Response:** `200 OK`
```json
[
  {
    "_id": "expense_id",
    "user": "user_id",
    "story": {
      "_id": "story_id",
      "name": "Story Name"
    },
    "amount": 250.50,
    "category": "Food",
    "paymentMode": "Credit Card",
    "date": "2024-01-15T00:00:00.000Z",
    "notes": "Grocery shopping",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### Get Single Expense
```
GET /expenses/:id
```
🔒 **Protected**

**Response:** `200 OK`
```json
{
  "_id": "expense_id",
  "user": "user_id",
  "story": {
    "_id": "story_id",
    "name": "Story Name"
  },
  "amount": 250.50,
  "category": "Food",
  "paymentMode": "Credit Card",
  "date": "2024-01-15T00:00:00.000Z",
  "notes": "Grocery shopping",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Create Expense
```
POST /expenses
```
🔒 **Protected**

**Request Body:**
```json
{
  "amount": 250.50,
  "category": "Food",
  "paymentMode": "Credit Card",
  "date": "2024-01-15",
  "notes": "Grocery shopping",
  "story": "story_id"  // optional
}
```

**Categories:** Food, Transportation, Shopping, Entertainment, Healthcare, Education, Bills, Travel, Other

**Payment Modes:** Cash, Credit Card, Debit Card, UPI, Net Banking, Other

**Response:** `201 Created`
```json
{
  "_id": "expense_id",
  "user": "user_id",
  "amount": 250.50,
  "category": "Food",
  "paymentMode": "Credit Card",
  "date": "2024-01-15T00:00:00.000Z",
  "notes": "Grocery shopping",
  "story": "story_id",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Update Expense
```
PUT /expenses/:id
```
🔒 **Protected**

**Request Body:** (all fields optional)
```json
{
  "amount": 275.00,
  "category": "Food",
  "paymentMode": "Debit Card",
  "date": "2024-01-16",
  "notes": "Updated notes",
  "story": "new_story_id"
}
```

**Response:** `200 OK` - Updated expense object

---

### Delete Expense
```
DELETE /expenses/:id
```
🔒 **Protected**

**Response:** `200 OK`
```json
{
  "message": "Expense removed"
}
```

---

## Story Endpoints

### Get All Stories
```
GET /stories
```
🔒 **Protected**

**Response:** `200 OK`
```json
[
  {
    "_id": "story_id",
    "user": "user_id",
    "name": "Europe Trip 2024",
    "budget": 5000,
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-30T00:00:00.000Z",
    "description": "Summer vacation budget",
    "createdAt": "2024-05-01T10:00:00.000Z"
  }
]
```

---

### Get Story Details
```
GET /stories/:id
```
🔒 **Protected**

**Response:** `200 OK`
```json
{
  "story": {
    "_id": "story_id",
    "user": "user_id",
    "name": "Europe Trip 2024",
    "budget": 5000,
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-30T00:00:00.000Z",
    "description": "Summer vacation budget"
  },
  "expenses": [
    {
      "_id": "expense_id",
      "amount": 250.50,
      "category": "Food",
      "paymentMode": "Credit Card",
      "date": "2024-06-05T00:00:00.000Z",
      "notes": "Restaurant"
    }
  ],
  "analytics": {
    "totalSpent": 1250.75,
    "budget": 5000,
    "remaining": 3749.25,
    "percentage": "25.02",
    "isOverBudget": false
  }
}
```

---

### Create Story
```
POST /stories
```
🔒 **Protected**

**Request Body:**
```json
{
  "name": "Europe Trip 2024",
  "budget": 5000,
  "startDate": "2024-06-01",
  "endDate": "2024-06-30",
  "description": "Summer vacation budget"
}
```

**Response:** `201 Created` - Story object

---

### Update Story
```
PUT /stories/:id
```
🔒 **Protected**

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "budget": 6000,
  "startDate": "2024-06-01",
  "endDate": "2024-07-15",
  "description": "Updated description"
}
```

**Response:** `200 OK` - Updated story object

---

### Delete Story
```
DELETE /stories/:id
```
🔒 **Protected**

**Response:** `200 OK`
```json
{
  "message": "Story removed"
}
```

**Note:** Deleting a story will unlink all associated expenses (set story to null) but won't delete the expenses.

---

## Analytics Endpoints

### Get Dashboard
```
GET /analytics/dashboard
```
🔒 **Protected**

**Response:** `200 OK`
```json
{
  "totalExpenses": 15750.50,
  "thisMonthTotal": 2345.75,
  "lastMonthTotal": 1950.00,
  "percentageChange": "20.29",
  "insight": "You spent 20.3% more this month compared to last month.",
  "expenseCount": 125
}
```

---

### Get Category-wise Expenses
```
GET /analytics/by-category?startDate=2024-01-01&endDate=2024-12-31
```
🔒 **Protected**

**Query Parameters:**
- `startDate` (optional): Filter start date
- `endDate` (optional): Filter end date

**Response:** `200 OK`
```json
[
  {
    "_id": "Food",
    "total": 5750.50,
    "count": 45
  },
  {
    "_id": "Transportation",
    "total": 3200.00,
    "count": 30
  }
]
```

---

### Get Weekly Expenses
```
GET /analytics/weekly
```
🔒 **Protected**

**Response:** `200 OK`
```json
[
  {
    "_id": 1,  // Sunday = 1, Monday = 2, etc.
    "total": 250.50,
    "count": 5
  },
  {
    "_id": 2,
    "total": 180.00,
    "count": 3
  }
]
```

---

### Get Monthly Expenses
```
GET /analytics/monthly?year=2024
```
🔒 **Protected**

**Query Parameters:**
- `year` (optional): Year to fetch (defaults to current year)

**Response:** `200 OK`
```json
[
  {
    "_id": 1,  // January = 1, February = 2, etc.
    "total": 2500.00,
    "count": 35
  },
  {
    "_id": 2,
    "total": 2100.00,
    "count": 28
  }
]
```

---

### Get Yearly Expenses
```
GET /analytics/yearly
```
🔒 **Protected**

**Response:** `200 OK`
```json
[
  {
    "_id": 2024,
    "total": 25000.00,
    "count": 250
  },
  {
    "_id": 2023,
    "total": 22000.00,
    "count": 220
  }
]
```

---

### Get Payment Mode Distribution
```
GET /analytics/by-payment-mode
```
🔒 **Protected**

**Response:** `200 OK`
```json
[
  {
    "_id": "Credit Card",
    "total": 8500.00,
    "count": 65
  },
  {
    "_id": "UPI",
    "total": 5200.00,
    "count": 48
  }
]
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Invalid user data"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "message": "Expense not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message details"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## CORS

CORS is enabled for all origins. Update this in production for security.

## Data Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, min 6 chars, hashed)
- `themeMode`: String (light/dark/auto, default: auto)

### Expense
- `user`: ObjectId (required)
- `story`: ObjectId (optional)
- `amount`: Number (required, >= 0)
- `category`: String (required, enum)
- `paymentMode`: String (required, enum)
- `date`: Date (required)
- `notes`: String (optional, max 500 chars)

### Story
- `user`: ObjectId (required)
- `name`: String (required, max 100 chars)
- `budget`: Number (required, >= 0)
- `startDate`: Date (required)
- `endDate`: Date (required, must be after startDate)
- `description`: String (optional, max 500 chars)
