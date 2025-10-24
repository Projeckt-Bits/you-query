# Authentication API Documentation

This directory contains the authentication API endpoints for YouQuery.

## Endpoints

### 1. Sign Up
**POST** `/api/auth/signup`

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe" // optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "uid": "user-unique-id",
    "email": "user@example.com",
    "emailVerified": false,
    "createdAt": "2025-10-23T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid input (missing email/password, weak password)
- `409`: Email already in use
- `500`: Server error

---

### 2. Login
**POST** `/api/auth/login`

Authenticates a user and returns an ID token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "uid": "user-unique-id",
    "email": "user@example.com",
    "emailVerified": false,
    "displayName": "John Doe"
  },
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Invalid email format
- `401`: Invalid email or password
- `403`: Account disabled
- `429`: Too many failed attempts
- `500`: Server error

---

### 3. Logout
**POST** `/api/auth/logout`

Signs out the current user.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Responses:**
- `500`: Server error

---

### 4. Verify Token
**GET** `/api/auth/verify`

Verifies the user's authentication token.

**Headers:**
```
Authorization: Bearer <idToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "uid": "user-unique-id",
    "email": "user@example.com",
    "emailVerified": false
  }
}
```

**Error Responses:**
- `401`: No token provided or invalid token
- `500`: Server error

---

## Usage Examples

### Using fetch API

#### Sign Up
```javascript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123',
    name: 'John Doe'
  }),
});

const data = await response.json();
```

#### Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123'
  }),
});

const data = await response.json();
// Store the token for future requests
localStorage.setItem('authToken', data.token);
```

#### Verify Token
```javascript
const token = localStorage.getItem('authToken');
const response = await fetch('/api/auth/verify', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const data = await response.json();
```

#### Logout
```javascript
const response = await fetch('/api/auth/logout', {
  method: 'POST',
});

const data = await response.json();
// Clear stored token
localStorage.removeItem('authToken');
```

---

## Security Notes

1. **Password Requirements**: Minimum 6 characters (enforced by Firebase)
2. **Token Storage**: Store tokens securely (use httpOnly cookies in production)
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Consider implementing rate limiting for production
5. **Environment Variables**: Ensure all Firebase credentials are in `.env.local`

---

## Error Codes

| Code | Description |
|------|-------------|
| `auth/email-already-in-use` | Email is already registered |
| `auth/invalid-email` | Invalid email format |
| `auth/weak-password` | Password is too weak |
| `auth/user-not-found` | User does not exist |
| `auth/wrong-password` | Incorrect password |
| `auth/user-disabled` | Account has been disabled |
| `auth/too-many-requests` | Too many failed attempts |

---

## Next Steps

1. Install required Firebase packages:
   ```bash
   npm install firebase firebase-admin
   ```

2. Ensure your `.env.local` file has all required Firebase credentials

3. Test the endpoints using tools like Postman or Thunder Client

4. Implement client-side authentication UI components
