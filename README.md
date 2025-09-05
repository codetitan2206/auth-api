# Auth API

A secure REST API with JWT authentication built with Node.js, Express, and MySQL.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting for security
- Comprehensive error handling
- Security headers with Helmet
- CORS support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Security**: Helmet, CORS, Express Rate Limit

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST/api/v1/auth/login` - Login user

### Users

- `GET /api/v1/users/me` - Get current user profile (JWT protected)

### Health Check

- `GET /api/v1/health` - API health status

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/codetitan2206/auth-api.git
   cd auth-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create MySQL database**

   ```sql
   CREATE DATABASE auth_api_db;
   ```

4. **Environment Configuration**

   Copy the `.env.example` file and update with your settings:

   ```bash
   cp .env .env.local
   ```

   Update these values in `.env`:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=auth_api_db
   DB_PORT=3306

   # JWT Configuration (Generate a strong secret)
   JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here_minimum_256_bits
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

5. **Start the server**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify installation**

   Visit: `http://localhost:3000/api/v1/health`

   You should see:

   ```json
   {
     "status": "OK",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "uptime": 1.234
   }
   ```

## API Usage Examples

### 1. Register a new user

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get current user profile

```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Security Features

### Password Requirements

- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&\*)

### Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes per IP

### JWT Security

- Tokens expire after 7 days (configurable)
- Signed with strong secret key
- Include issuer and audience claims

### Other Security Measures

- Password hashing with bcrypt (12 rounds)
- SQL injection protection with parameterized queries
- Input validation and sanitization
- Security headers with Helmet
- CORS configuration

## Project Structure

```
auth-api/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validation.js        # Input validation middleware
├── models/
│   └── User.js              # User model and database methods
├── routes/
│   ├── auth.js              # Authentication routes
│   └── users.js             # User routes
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
├── server.js                # Main application file
└── README.md                # This file
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Common HTTP Status Codes

- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `409` - Conflict (email already exists)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## Testing with Postman

1. Import the provided Postman collection
2. Set the base URL to `http://localhost:3000`
3. For protected endpoints, add the JWT token to Authorization header as `Bearer <token>`

## Production Considerations

### Environment Variables

Ensure these are properly set in production:

```env
NODE_ENV=production
JWT_SECRET=<strong-secret-key-minimum-256-bits>
DB_PASSWORD=<strong-database-password>
```

### Database

- Use connection pooling (already implemented)
- Enable SSL connections
- Regular backups
- Monitor performance

### Security

- Use HTTPS in production
- Set up
