# FixItNow Backend API

A comprehensive backend system for FixItNow remote tech support platform built with Node.js, Express, PostgreSQL, and JWT authentication.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Session Management**: Complete booking and technician assignment system
- **Payment Processing**: Stripe integration for secure payments
- **Email Notifications**: Automated emails for all session events
- **Admin Dashboard**: Comprehensive admin panel with analytics
- **Feedback System**: Customer rating and review system
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT tokens with bcrypt password hashing
- **Payments**: Stripe API integration
- **Email**: Nodemailer with SMTP
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, CORS, rate limiting, input validation

## 📋 Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Stripe account (for payments)
- SMTP email service (Gmail, SendGrid, etc.)

## ⚡ Quick Start

### 1. Installation

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fixitnow
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE fixitnow;
```

Run migrations:

```bash
npm run migrate
```

Seed with sample data:

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3001/api-docs`
- **Health Check**: `http://localhost:3001/health`

## 🔐 Authentication

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "customer"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Use JWT Token
Include in all authenticated requests:
```bash
Authorization: Bearer your_jwt_token_here
```

## 📊 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/change-password` - Change password

### Sessions
- `POST /api/sessions/book` - Book new session
- `GET /api/sessions/my` - Get user's sessions
- `GET /api/sessions/:id` - Get session details
- `PUT /api/sessions/:id/update` - Update session (technician)
- `POST /api/sessions/:id/cancel` - Cancel session

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/technicians` - List technicians (admin)
- `GET /api/users/:id/stats` - User statistics

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Payment history
- `POST /api/payments/:id/refund` - Request refund
- `POST /api/payments/webhook` - Stripe webhook

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/sessions` - All sessions with filters
- `POST /api/admin/sessions/:id/assign` - Assign technician
- `GET /api/admin/users` - All users with filters
- `POST /api/admin/users/:id/toggle-status` - Toggle user status
- `GET /api/admin/revenue` - Revenue analytics

### Feedback
- `POST /api/feedback/:sessionId` - Submit feedback
- `GET /api/feedback/technician/:id` - Technician feedback
- `GET /api/feedback/session/:id` - Session feedback

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers
- **SQL Injection Prevention**: Parameterized queries

## 💳 Payment Integration

### Stripe Setup

1. Create Stripe account and get API keys
2. Configure webhook endpoint: `/api/payments/webhook`
3. Set webhook events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### Payment Flow

1. Customer books session
2. Create payment intent: `POST /api/payments/create-intent`
3. Process payment on frontend with Stripe.js
4. Confirm payment: `POST /api/payments/confirm`
5. Webhook updates transaction status

## 📧 Email Notifications

Automated emails are sent for:
- Welcome new users
- Session confirmation
- Technician assignment
- Session reminders
- Session completion
- Payment confirmations

Configure SMTP settings in `.env` file.

## 🗄 Database Schema

### Users Table
```sql
- id (Primary Key)
- name, email, password_hash
- role (customer, technician, admin)
- active, created_at, updated_at, last_login
```

### Sessions Table
```sql
- id (Primary Key)
- customer_id, technician_id (Foreign Keys)
- issue_type, issue_description
- status, urgency, scheduled_time
- remote_link, technician_notes
- rating, feedback
- created_at, updated_at
```

### Transactions Table
```sql
- id (Primary Key)
- user_id, session_id (Foreign Keys)
- amount, currency, payment_method
- stripe_payment_id, status
- created_at, updated_at
```

## 🧪 Testing

### Sample Login Credentials (after seeding)

**Admin**
- Email: `admin@fixitnow.com`
- Password: `admin123`

**Technician**
- Email: `sarah@fixitnow.com`
- Password: `technician123`

**Customer**
- Email: `john@example.com`
- Password: `customer123`

### Test API with cURL

```bash
# Register new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'

# Book session (replace TOKEN with JWT from login)
curl -X POST http://localhost:3001/api/sessions/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"issue_type":"Computer slow","issue_description":"My computer is running very slowly","scheduled_time":"2024-01-15T10:00:00Z"}'
```

## 🚀 Production Deployment

### Environment Variables
Set all production environment variables:
- Use strong JWT secret
- Configure production database
- Set up production email service
- Use production Stripe keys
- Set NODE_ENV=production

### Database
- Use connection pooling
- Set up database backups
- Configure SSL connections
- Monitor performance

### Security
- Use HTTPS only
- Configure proper CORS origins
- Set up monitoring and logging
- Regular security updates

## 📈 Monitoring & Analytics

The admin dashboard provides:
- Total users, sessions, revenue
- Session status distribution
- Technician performance metrics
- Revenue analytics by period
- Recent activity logs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Email: support@fixitnow.com
- Documentation: `/api-docs`
- Health Check: `/health`