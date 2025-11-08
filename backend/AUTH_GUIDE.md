# 🔐 Authentication Implementation Guide

## **Overview**

Backend authentication is now fully implemented with JWT-based secure endpoints. All expense and analytics data is isolated per user.

---

## **Architecture**

```
┌──────────────────────────────────────────┐
│  Frontend (React)                        │
│  - Login/Register pages                  │
│  - Store JWT in localStorage             │
│  - Attach token to API requests          │
└──────────┬───────────────────────────────┘
           │
    POST /api/users/register
    POST /api/users/login
    GET /api/users/me (protected)
           │
┌──────────▼───────────────────────────────┐
│  Backend (Express)                       │
│  - Auth middleware verifies JWT          │
│  - Extracts userId from token            │
│  - Protects expense/analytics endpoints  │
└──────────┬───────────────────────────────┘
           │
┌──────────▼───────────────────────────────┐
│  Database (MongoDB)                      │
│  - User documents with hashed passwords  │
│  - Expense documents filtered by userId  │
│  - Per-user analytics isolation          │
└──────────────────────────────────────────┘
```

---

## **Files Updated**

### **1. Middleware: `src/middleware/auth.js`** ✅

**Purpose:** Verify JWT tokens and attach user context to requests

**Key Functions:**
- Extracts token from `Authorization: Bearer <token>` header
- Verifies token signature and expiration
- Attaches `req.userId` and `req.user` to request
- Returns 401 on invalid/expired tokens

**Usage:**
```javascript
const authMiddleware = require('../middleware/auth');
router.get('/protected', authMiddleware, handler);
```

### **2. Controllers Updated:**

#### **userController.js**
- ✅ `register` - Creates user, returns JWT (7-day expiry)
- ✅ `login` - Verifies credentials, returns JWT
- ✅ `getCurrentUser` - Protected endpoint, returns authenticated user data

#### **expenseController.js**
- ✅ All CRUD operations now filter by `req.userId`
- ✅ Ownership verification (403 if not owner)
- ✅ Audit logging for create/update/delete

#### **analyticsController.js**
- ✅ `getAnalytics` - User-specific totals and breakdowns
- ✅ `getCategoryBreakdown` - Per-user category analysis
- ✅ `getMonthlyTrends` - Per-user monthly data

### **3. Routes Protected:**

#### **`src/routes/users.js`**
```javascript
POST   /api/users/register    // Public (no auth needed)
POST   /api/users/login       // Public (no auth needed)
GET    /api/users/me          // Protected (auth required)
```

#### **`src/routes/expenses.js`**
```javascript
GET    /api/expenses          // Protected (auth required)
POST   /api/expenses          // Protected (auth required)
GET    /api/expenses/:id      // Protected + ownership check
PUT    /api/expenses/:id      // Protected + ownership check
DELETE /api/expenses/:id      // Protected + ownership check
GET    /api/expenses/category // Protected
GET    /api/expenses/monthly  // Protected
```

#### **`src/routes/analytics.js`**
```javascript
GET    /api/analytics         // Protected (auth required)
GET    /api/analytics/category // Protected
GET    /api/analytics/monthly // Protected
```

---

## **API Endpoints Reference**

### **1. Register User**

**Endpoint:**
```
POST /api/users/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error (400):**
```json
{
  "error": "User already exists with this email"
}
```

---

### **2. Login User**

**Endpoint:**
```
POST /api/users/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error (401):**
```json
{
  "error": "Invalid email or password"
}
```

---

### **3. Get Current User (Protected)**

**Endpoint:**
```
GET /api/users/me
Authorization: Bearer <your_token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error (401):**
```json
{
  "error": "No token provided. Use Authorization: Bearer <token>"
}
```

---

### **4. Get User Expenses (Protected)**

**Endpoint:**
```
GET /api/expenses
Authorization: Bearer <your_token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "category": "Food",
    "amount": 350,
    "description": "Lunch at cafe",
    "date": "2025-11-09T12:45:00Z",
    "createdAt": "2025-11-09T12:45:00Z",
    "updatedAt": "2025-11-09T12:45:00Z"
  }
]
```

**Error (401):**
```json
{
  "error": "No token provided. Use Authorization: Bearer <token>"
}
```

---

### **5. Create Expense (Protected)**

**Endpoint:**
```
POST /api/expenses
Authorization: Bearer <your_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "category": "Food",
  "amount": 350,
  "description": "Lunch at cafe",
  "date": "2025-11-09"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "category": "Food",
  "amount": 350,
  "description": "Lunch at cafe",
  "date": "2025-11-09T00:00:00Z"
}
```

---

## **How It Works**

### **Step 1: User Registration**
1. User submits form (name, email, password)
2. Backend checks if email already exists
3. Password is hashed using bcrypt
4. User document created in MongoDB
5. JWT token generated and returned
6. Token expires in 7 days

### **Step 2: User Login**
1. User submits email and password
2. Backend finds user by email
3. Backend compares password with hashed version
4. If match, JWT token generated and returned
5. Token is valid for 7 days

### **Step 3: Protected Request (e.g., Create Expense)**
1. Frontend extracts JWT from localStorage
2. Frontend sends request with `Authorization: Bearer <token>`
3. Auth middleware intercepts request
4. Middleware verifies token signature
5. Middleware extracts userId from token
6. Middleware attaches `req.userId` to request
7. Route handler uses `req.userId` to filter/create user-specific data
8. Response is sent back

### **Step 4: Token Expiration**
1. If token expires, backend returns 401
2. Frontend detects 401 and redirects to login
3. User logs in again to get fresh token

---

## **Testing Authentication**

### **Using Postman/cURL**

**Register:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!","confirmPassword":"Test123!"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Copy the token from response, then:**

**Get Protected Endpoint:**
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Expense (Protected):**
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"category":"Food","amount":250,"description":"Lunch"}'
```

---

## **Error Codes**

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check request body and format |
| 401 | Unauthorized | Missing/invalid/expired token |
| 403 | Forbidden | Not owner of resource |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Check server logs |

---

## **Security Considerations**

✅ **Passwords hashed** with bcryptjs (10 salt rounds)
✅ **Tokens signed** with JWT_SECRET
✅ **Tokens expire** in 7 days
✅ **User isolation** - each user sees only their data
✅ **Ownership verification** - can't delete another user's expense
✅ **HTTPS enforced** (in production)

---

## **Environment Variables**

Add to `.env`:
```
JWT_SECRET=your_super_secret_jwt_key_here
# Or use default in code: 'your_jwt_secret_key_here'
```

---

## **Next Steps**

1. **Frontend Login/Register pages** (React components)
2. **Token storage** (localStorage + refreshing)
3. **API interceptor** (attach token to all requests)
4. **Protected routes** (redirect to login if not authenticated)
5. **Logout functionality** (clear token, redirect)

---

## **Troubleshooting**

### **"No token provided"**
- Ensure Authorization header is set
- Format: `Authorization: Bearer <token>` (space after Bearer)

### **"Invalid token"**
- Token may be corrupted
- Try logging in again

### **"Token expired"**
- Token valid for 7 days
- Log in again to get new token

### **"Not authorized to access this expense"**
- You're trying to access another user's expense
- Only owners can view/edit/delete their expenses

---

