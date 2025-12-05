# Online Health Consultation System - Backend Service

Backend RESTful API for the Online Health Consultation System built with Node.js, Express, TypeScript, Prisma ORM, and MySQL.

**Version:** 1.0.0 | **Status:** ✅ Production Ready

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Authentication & Authorization](#-authentication--authorization)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)

---

## 🚀 Features

- ✅ **JWT Authentication** - Access tokens (30m) + Refresh tokens (7d) with secure rotation
- ✅ **Role-Based Access Control** - Three roles: PATIENT, DOCTOR, ADMIN
- ✅ **User Management** - Complete CRUD for users with profiles
- ✅ **Consultation System** - Question/Answer system between patients and doctors
- ✅ **Appointment Management** - Schedule, confirm, cancel, and complete appointments
- ✅ **Rating System** - Patient ratings with automatic doctor score calculation
- ✅ **Content Moderation** - Admin tools for moderating questions, answers, and ratings
- ✅ **Reports & Analytics** - Statistics, charts, and insights for system monitoring
- ✅ **Type Safety** - Full TypeScript with strict mode
- ✅ **Input Validation** - Zod schema validation on all endpoints
- ✅ **Error Handling** - Centralized error middleware with consistent responses

---

## 🛠 Tech Stack

**Backend Framework:**
- Node.js 18+
- Express 4.18.2
- TypeScript 5.3.3

**Database:**
- MySQL 8.0+
- Prisma ORM 5.7.0

**Authentication & Security:**
- jsonwebtoken (JWT)
- bcryptjs (password hashing)
- cors (CORS middleware)

**Validation & Utils:**
- Zod 3.22.4 (schema validation)
- morgan (HTTP logging)

**Development:**
- ts-node-dev (hot reload)
- Prisma Studio (database GUI)

---

## ⚡ Quick Start

### Option 1: Using Docker (Recommended)

```bash
# Install dependencies
npm install

# Start MySQL database with Docker
docker-compose up -d

# Wait a few seconds for MySQL to start, then run migrations
npx prisma migrate dev

# Seed database with test data
npx prisma db seed

# Start development server
npm run dev
```

### Option 2: Using Local MySQL

```bash
# Install dependencies
npm install

# Configure .env file with your database credentials
# See Configuration section below

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start development server
npm run dev
```

**Server URL:** http://localhost:4000

---

## 🛠️ Installation

### Prerequisites

- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ MySQL 8.0+ (running)
- ✅ npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

---

## ⚙️ Configuration

Edit `.env` with your settings:

```env
# Server
NODE_ENV=development
PORT=4000

# Database
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/health_consultation_db"

# JWT Secrets (change these in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_ACCESS_EXPIRE=30m
JWT_REFRESH_EXPIRE=7d

# Security
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:5173
```

**Important:** Replace `YOUR_PASSWORD` with your MySQL root password.

---

## 🗄️ Database Setup

### Option 1: Using Docker

Docker Compose will automatically create and configure MySQL for you.

```bash
# Start MySQL container
docker-compose up -d

# Check container status
docker-compose ps

# View logs (optional)
docker-compose logs -f mysql

# Run migrations
npx prisma migrate dev

# Seed initial data
npx prisma db seed
```

**Docker Commands:**
```bash
docker-compose up -d      # Start database
docker-compose down       # Stop database
docker-compose down -v    # Stop and remove data
docker-compose logs mysql # View logs
docker-compose restart    # Restart database
```

**Optional: phpMyAdmin**
Uncomment the `phpmyadmin` section in `docker-compose.yml`, then:
```bash
docker-compose up -d
```
Access at http://localhost:8080 (user: `root`, password: `password`)

### Option 2: Using Local MySQL

If you prefer to use a local MySQL installation:

#### Create Database

```sql
CREATE DATABASE health_consultation_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

#### Run Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

#### Seed Initial Data

```bash
npm run prisma:seed
```

### What Gets Created

After running the seed command, you'll have:

**5 Medical Specialties:**
- Cardiology
- Dermatology
- Pediatrics
- Orthopedics
- General Medicine

**6 User Accounts:**
- 1 Admin
- 3 Doctors (each with different specialties)
- 2 Patients

**All test accounts use password:** `password123`

---

## 🏃 Running the Application

### Development Mode (Hot Reload)

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Database GUI (Prisma Studio)

```bash
npm run prisma:studio
```

Opens at http://localhost:5555

---

## 📚 API Documentation

**Base URL:** `http://localhost:4000/api`

### Health Check

```bash
GET /api/health
```

Returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "Online Health Consultation API"
}
```

---

### 🔐 Authentication Endpoints

#### Register
```
POST /api/auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "PATIENT"
}
```

#### Login
```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "xxx",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "PATIENT"
    }
  }
}
```

#### Refresh Token
```
POST /api/auth/refresh
Body: { "refreshToken": "..." }
```

#### Logout
```
POST /api/auth/logout
Body: { "refreshToken": "..." }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

---

### 👤 Patient Endpoints (Role: PATIENT)

All require authentication + PATIENT role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients/profile` | Get patient profile |
| PUT | `/patients/profile` | Update patient profile |
| GET | `/patients/questions` | Get all my questions |
| POST | `/patients/questions` | Create new question |
| GET | `/patients/appointments` | Get all my appointments |
| POST | `/patients/appointments` | Book appointment |
| GET | `/patients/history` | Get consultation history |
| POST | `/patients/ratings` | Rate a doctor |

**Example - Create Question:**
```json
POST /api/patients/questions
{
  "title": "Question about heart health",
  "content": "I've been experiencing...",
  "doctorId": "optional-doctor-id"
}
```

---

### 👨‍⚕️ Doctor Endpoints (Role: DOCTOR)

All require authentication + DOCTOR role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctors/me` | Get profile with stats |
| GET | `/doctors/questions` | Get questions (paginated) |
| POST | `/doctors/questions/:id/answers` | Answer a question |
| GET | `/doctors/appointments` | Get appointments |
| PUT | `/doctors/appointments/:id` | Update appointment |
| GET | `/doctors/schedule` | Get schedule |
| POST | `/doctors/schedule` | Update schedule |

**Query Parameters:**
- `status`: Filter by status (PENDING, ANSWERED, etc.)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

---

### 👑 Admin Endpoints (Role: ADMIN)

All require authentication + ADMIN role.

#### User Management
```
GET    /admin/users
POST   /admin/users
PUT    /admin/users/:id
DELETE /admin/users/:id
```

#### Doctor & Patient Lists
```
GET /admin/doctors
GET /admin/patients
```

#### Specialty Management
```
GET    /admin/specialties
POST   /admin/specialties
PUT    /admin/specialties/:id
DELETE /admin/specialties/:id
```

#### Moderation
```
GET   /admin/moderation/questions
PATCH /admin/questions/:id/moderate
PATCH /admin/answers/:id/moderate
GET   /admin/moderation/ratings
PATCH /admin/ratings/:id/moderate
```

---

### 📊 Reports & Statistics (Role: ADMIN)

All require authentication + ADMIN role.

| Endpoint | Description |
|----------|-------------|
| `/reports/stats` | Overall statistics |
| `/reports/stats/consultations` | Consultations by date |
| `/reports/stats/active-users` | Active users stats |
| `/reports/appointments-chart` | Appointment chart data |
| `/reports/questions-chart` | Questions chart data |
| `/reports/top-doctors` | Top-rated doctors |
| `/reports/specialty-distribution` | Doctors by specialty |

**Query Parameters:**
- `from`: Start date (YYYY-MM-DD)
- `to`: End date (YYYY-MM-DD)
- `limit`: Number of results

---

## 🗂️ Project Structure

```
Service/
├── 📄 Configuration
│   ├── package.json          # Dependencies & scripts
│   ├── tsconfig.json         # TypeScript config
│   ├── .env                  # Environment variables
│   ├── .env.example          # Environment template
│   ├── .gitignore            # Git ignore rules
│   └── README.md             # Documentation
│
├── 🗄️ Database
│   └── prisma/
│       ├── schema.prisma     # Database schema
│       └── seed.ts           # Initial data
│
└── 📂 Source Code (src/)
    ├── server.ts             # Entry point
    ├── app.ts                # Express configuration
    │
    ├── config/
    │   ├── env.ts            # Environment validation
    │   └── db.ts             # Prisma client
    │
    ├── controllers/          # Request handlers
    │   ├── auth.controller.ts
    │   ├── patient.controller.ts
    │   ├── doctor.controller.ts
    │   ├── admin.controller.ts
    │   └── report.controller.ts
    │
    ├── services/             # Business logic
    │   ├── auth.service.ts
    │   ├── patient.service.ts
    │   ├── doctor.service.ts
    │   ├── admin.service.ts
    │   └── report.service.ts
    │
    ├── routes/               # Route definitions
    │   ├── auth.routes.ts
    │   ├── patient.routes.ts
    │   ├── doctor.routes.ts
    │   ├── admin.routes.ts
    │   ├── report.routes.ts
    │   └── index.ts
    │
    ├── middlewares/          # Express middleware
    │   ├── auth.middleware.ts
    │   ├── role.middleware.ts
    │   ├── error.middleware.ts
    │   └── validation.middleware.ts
    │
    └── utils/                # Utilities
        ├── jwt.ts
        ├── password.ts
        └── apiResponse.ts
```

---

## 🔐 Authentication & Authorization

## 🧪 Testing

### Test Credentials (After Seeding)

After running `npx prisma db seed`, use these accounts to test the application:

#### 👑 Admin Account
```
Email:    admin@healthconsult.com
Password: password123
```
**Permissions:** Full system access, user management, moderation, reports

---

#### 👨‍⚕️ Doctor Accounts

**Dr. John Smith - Cardiology**
```
Email:    dr.smith@healthconsult.com
Password: password123
Specialty: Cardiology
Experience: 15 years
```

### Quick Test with curl

```bash
# Health check
curl http://localhost:4000/api/health

# Login as Admin
curl -X POST http://localhost:4000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@healthconsult.com\",\"password\":\"password123\"}"

# Login as Doctor
curl -X POST http://localhost:4000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"dr.smith@healthconsult.com\",\"password\":\"password123\"}"

# Login as Patient
curl -X POST http://localhost:4000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"patient1@example.com\",\"password\":\"password123\"}"
```il:    dr.lee@healthconsult.com
Password: password123
Specialty: Pediatrics
Experience: 8 years
```

**Permissions:** Answer questions, manage appointments, update schedule

---

#### 👤 Patient Accounts

**Alice Williams**
```
Email:    patient1@example.com
Password: password123
Gender:   Female
DOB:      May 15, 1990
Phone:    555-0101
```

**Bob Anderson**
```
Email:    patient2@example.com
Password: password123
Gender:   Male
DOB:      August 20, 1985
Phone:    555-0102
```

**Permissions:** Ask questions, book appointments, rate doctors

--- Main Tables

**Users & Profiles:**
- `users` - Base user (email, password, role)
- `patient_profiles` - Patient data
- `doctor_profiles` - Doctor data + specialty

**Core Features:**
- `specialties` - Medical specialties
- `questions` - Patient questions
- `answers` - Doctor answers
- `appointments` - Scheduled consultations
- `ratings` - Doctor ratings
- `refresh_tokens` - Active tokens

### Relationships

- User → PatientProfile (1:1)
- User → DoctorProfile (1:1)
- DoctorProfile → Specialty (N:1)
- Patient → Questions (1:N)
- Question → Answers (1:N)
- Patient → Appointments (1:N)
- Doctor → Appointments (1:N)
- Appointment → Rating (1:1)

---

## 🧪 Testing

### Test Accounts (after seeding)

**Admin:**
```
## 🐛 Troubleshooting

### Database Connection Failed

**If using Docker:**
```bash
# Check if container is running
docker-compose ps

# View logs
docker-compose logs mysql

# Restart containers
docker-compose restart

# If still failing, recreate everything
docker-compose down -v
docker-compose up -d
```

**If using local MySQL:**
1. Check MySQL is running: `sc query MySQL80`
2. Verify credentials in `.env`
3. Ensure database exists:
   ```sql
   SHOW DATABASES;
   ```
4. Test connection: `mysql -u root -p`
**Patients:**
```
Alice Williams: patient1@example.com
Bob Anderson:   patient2@example.com
Password: password123
```

### Test with curl

```bash
# Health check
curl http://localhost:4000/api/health

# Login
curl -X POST http://localhost:4000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@healthconsult.com\",\"password\":\"password123\"}"
```

### Response Format

**Success:**
```json
{
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

**Error:**
```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

---

## 🐛 Troubleshooting

### Database Connection Failed

**Solutions:**
1. Check MySQL is running: `sc query MySQL80`
2. Verify credentials in `.env`
3. Ensure database exists:
   ```sql
   SHOW DATABASES;
   ```
4. Test connection: `mysql -u root -p`

### Port 4000 Already in Use

**Solutions:**
1. Change `PORT` in `.env` to 4001
2. Or find and kill process:
   ```cmd
   netstat -ano | findstr :4000
   taskkill /PID <PID> /F
   ```

## 🔧 Available Scripts

### Application Scripts
```bash
npm run dev              # Start dev server (hot reload)
npm run build            # Build TypeScript → JavaScript
npm start                # Run production build
```

### Database Scripts
```bash
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open database GUI (localhost:5555)
npm run prisma:seed      # Seed initial data
```

### Docker Scripts
```bash
docker-compose up -d          # Start MySQL container
docker-compose down           # Stop containers
docker-compose down -v        # Stop and remove volumes
docker-compose logs -f mysql  # View MySQL logs
docker-compose restart        # Restart containers
docker-compose ps             # Check container status
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Module Not Found

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Migration Errors

**Reset database:**
```bash
npx prisma migrate reset
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=mysql://user:pass@host:3306/db
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
CORS_ORIGIN=https://your-frontend.com
BCRYPT_ROUNDS=12
```

### Start Production Server

```bash
npm start
```

### Deployment Checklist

- ✅ Environment variables configured
- ✅ Database migrated
- ✅ Strong JWT secrets set
- ✅ CORS origin set to production URL
- ✅ HTTPS enabled (recommended)
- ✅ Rate limiting configured (optional)
- ✅ Logging configured
- ✅ Database backups scheduled

---

## 🔧 Available Scripts

```bash
npm run dev              # Start dev server (hot reload)
npm run build            # Build TypeScript → JavaScript
npm start                # Run production build
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open database GUI
npm run prisma:seed      # Seed initial data
```

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review error logs in terminal
3. Use Prisma Studio to inspect database
4. Verify `.env` configuration

---

## 📄 License

MIT

---

## 👥 Contributors

Developed for university project: **Online Health Consultation System**

**Frontend:** OnlineHealthConsultation-Web (React + TypeScript)  
**Backend:** OnlineHealthConsultation-Service (Node.js + Express + TypeScript)

---

**🎉 Ready to serve your frontend application!**

**Last Updated:** December 2024 | **Version:** 1.0.0
