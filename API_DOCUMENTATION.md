# API Documentation - Frontend Integration

This document describes all API endpoints used by the Filmify frontend application.

## 🔗 Base URL

```
Development: http://localhost:5000
Production: https://api.filmify.com
```

## 🔐 Authentication

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user",
      "balance": 5000
    }
  }
}
```

### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response (201): Same as login
```

### Forgot Password - Request Code
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "Reset code sent to email"
}
```

### Forgot Password - Verify Code
```
POST /auth/verify-reset-code
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}

Response (200):
{
  "success": true,
  "message": "Code verified"
}
```

### Reset Password
```
POST /auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newpassword123"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Change Password (Protected)
```
POST /auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "oldPassword": "currentpassword",
  "newPassword": "newpassword123"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Get Current User (Protected)
```
GET /auth/user
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "balance": 5000
  }
}
```

---

## 🎬 Movies

### Get All Movies
```
GET /movies?page=1&limit=10&genre=action&search=term

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- genre: string (optional)
- search: string (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "movie_id",
      "title": "Movie Title",
      "description": "Description",
      "genre": "Action",
      "rating": "PG-13",
      "price": 250,
      "posterUrl": "url",
      "imageUrl": "url",
      "videoUrl": "url",
      "duration": 120,
      "releaseDate": "2026-03-20T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

### Get Movie by ID
```
GET /movies/:id

Response (200):
{
  "success": true,
  "data": {
    "id": "movie_id",
    "title": "Movie Title",
    "description": "Description",
    "genre": "Action",
    "rating": "PG-13",
    "price": 250,
    "posterUrl": "url",
    "imageUrl": "url",
    "videoUrl": "url",
    "duration": 120,
    "releaseDate": "2026-03-20T10:30:00Z",
    "cinema": {
      "id": "cinema_id",
      "name": "Cinema Hall 1",
      "location": "City",
      "numbering": 1
    }
  }
}
```

### Add Movie (Admin Protected)
```
POST /movies
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Fields:
- title: string
- description: string
- genre: string
- rating: string
- price: number
- cinema: string (cinema id)
- releaseDate: string (ISO format)
- showTime: string (HH:mm)
- duration: number
- posterUrl: file
- imageUrl: file
- videoUrl: file

Response (201):
{
  "success": true,
  "data": { movie object }
}
```

### Update Movie (Admin Protected)
```
PUT /movies/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data

Same fields as Add Movie

Response (200):
{
  "success": true,
  "data": { updated movie }
}
```

### Delete Movie (Admin Protected)
```
DELETE /movies/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Movie deleted"
}
```

---

## 🎭 Cinemas

### Get All Cinemas
```
GET /cinemas?page=1&limit=10

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "cinema_id",
      "name": "Cinema Name",
      "location": "City Location",
      "numbering": 1,
      "seatingCapacity": 150,
      "seats": [
        {
          "id": "seat_id",
          "row": "A",
          "number": 1,
          "isAvailable": true
        }
      ]
    }
  ]
}
```

### Get Cinema by ID
```
GET /cinemas/:id

Response (200):
{
  "success": true,
  "data": { cinema object with full details }
}
```

### Add Cinema (Admin Protected)
```
POST /cinemas
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Cinema Name",
  "location": "City Location",
  "numbering": 1,
  "seatingCapacity": 150
}

Response (201):
{
  "success": true,
  "data": { cinema object }
}
```

### Update Cinema (Admin Protected)
```
PUT /cinemas/:id
Authorization: Bearer {token}
Content-Type: application/json

{ same fields as POST }

Response (200):
{
  "success": true,
  "data": { updated cinema }
}
```

---

## 💺 Seats

### Get Available Seats
```
GET /seats/available?movieId=movie_id&cinemaId=cinema_id

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "seat_id",
      "row": "A",
      "number": 1,
      "isAvailable": true,
      "price": 250
    }
  ]
}
```

### Book Seats (Protected)
```
POST /seats/book
Authorization: Bearer {token}
Content-Type: application/json

{
  "movieId": "movie_id",
  "seatIds": ["seat_id_1", "seat_id_2"],
  "totalPrice": 500
}

Response (201):
{
  "success": true,
  "data": {
    "bookingId": "booking_id",
    "seats": [ seat objects ],
    "status": "pending"
  }
}
```

---

## 🎫 Tickets

### Get My Tickets (Protected)
```
GET /tickets?page=1&limit=10

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "ticket_id",
      "movieTitle": "Movie Title",
      "cinemaName": "Cinema Name",
      "seats": ["A1", "A2"],
      "showDate": "2026-03-20",
      "showTime": "10:30",
      "totalPrice": 500,
      "status": "confirmed",
      "qrCode": "qr_code_url",
      "bookedAt": "2026-03-18T10:30:00Z"
    }
  ]
}
```

### Get Ticket by ID (Protected)
```
GET /tickets/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": { ticket object with QR code }
}
```

---

## 💳 Payments

### Add Payment Method (Protected)
```
POST /payments/method
Authorization: Bearer {token}
Content-Type: application/json

{
  "cardNumber": "4111111111111111",
  "cardholderName": "John Doe",
  "expiryDate": "12/25",
  "cvv": "123"
}

Response (201):
{
  "success": true,
  "data": { 
    "id": "payment_method_id",
    "last4": "1111"
  }
}
```

### Create Payment (Protected)
```
POST /payments/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 500,
  "currency": "AMD",
  "description": "Movie ticket booking",
  "paymentMethodId": "payment_method_id"
}

Response (201):
{
  "success": true,
  "data": {
    "paymentId": "payment_id",
    "clientSecret": "stripe_client_secret",
    "status": "pending"
  }
}
```

### Confirm Payment (Protected)
```
POST /payments/confirm/:paymentId
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentIntentId": "stripe_payment_intent_id"
}

Response (200):
{
  "success": true,
  "data": {
    "paymentId": "payment_id",
    "status": "completed",
    "ticketId": "ticket_id"
  }
}
```

### Get Payment History (Protected)
```
GET /payments/history?page=1&limit=10&status=completed

Query Parameters:
- page: number
- limit: number
- status: pending|completed|failed
- startDate: ISO date
- endDate: ISO date

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "payment_id",
      "amount": 500,
      "currency": "AMD",
      "status": "completed",
      "method": "card",
      "description": "Movie ticket",
      "createdAt": "2026-03-18T10:30:00Z"
    }
  ]
}
```

---

## 📅 Showtimes

### Get Movie Showtimes
```
GET /showtimes?movieId=movie_id&cinemaId=cinema_id

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "showtime_id",
      "movieId": "movie_id",
      "cinemaId": "cinema_id",
      "date": "2026-03-20",
      "time": "10:30",
      "availableSeats": 120,
      "totalSeats": 150
    }
  ]
}
```

### Get Calendar Events (Admin)
```
GET /showtimes/calendar?month=3&year=2026

Response (200):
{
  "success": true,
  "data": [
    {
      "date": "2026-03-20",
      "title": "Movie Title",
      "count": 3
    }
  ]
}
```

---

## 👥 Users (Admin)

### Get All Users (Admin Protected)
```
GET /users?page=1&limit=10&search=term

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user",
      "balance": 5000,
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ]
}
```

### Get User Details (Admin Protected)
```
GET /users/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": { full user object }
}
```

---

## ❌ Error Responses

### Standard Error Format
```
Response (400/401/403/500):
{
  "success": false,
  "message": "Error description",
  "error": "error_code"
}
```

### Common Error Codes
- `INVALID_CREDENTIALS` - Wrong email/password
- `TOKEN_EXPIRED` - JWT expired
- `UNAUTHORIZED` - Missing token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input
- `SERVER_ERROR` - Internal error

---

## 🔄 Request/Response Interceptors

### Frontend Implementation
```javascript
// Add auth token to requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📖 Rate Limiting

- General endpoints: 100 requests/minute
- Auth endpoints: 5 requests/minute
- Payment endpoints: 10 requests/minute

---

## 🔒 CORS

Allowed origins (environment-dependent):
- `http://localhost:8888` (development)
- `https://filmify.com` (production)

---

**Last Updated:** March 18, 2026
**Version:** 1.0.0
