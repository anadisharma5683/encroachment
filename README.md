# Encroachment Reporting System with MongoDB Integration

This project integrates MongoDB with the login system to store and validate user credentials.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (connection string already configured)

## Project Structure

```
encroachment/
├── src/              # Frontend React application
├── server/           # Backend API server
│   ├── server.js     # Main server file (using Node.js HTTP module)
│   ├── package.json  # Server dependencies
│   └── seed.js       # Database seeding script
├── package.json      # Root project configuration
└── ...
```

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Seed the Database:**
   ```bash
   cd server
   node seed.js
   ```
   This creates three test users:
   - Admin: username `admin`, password `1`
   - Employee: username `employee`, password `1`
   - Citizen: username `citizen`, password `1`

3. **Run the Application:**
   
   You can run the frontend and backend separately or together:
   
   **Option 1: Run separately**
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm start
   
   # Terminal 2 - Start frontend
   npm run dev
   ```
   
   **Option 2: Run concurrently**
   ```bash
   npm run dev:full
   ```

4. **Access the Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5003

## MongoDB Integration

The login system now uses MongoDB to validate user credentials. The connection is established with:

```
mongodb+srv://osirisuzu2_db_user:T7QMnuOtXx6wVSTJ@cluster0.wvephzd.mongodb.net/?appName=Cluster0
```

## API Endpoints

- `POST /api/login` - Authenticate user
- `POST /api/register` - Register new user
- `GET /api/health` - Health check

## Test Credentials

Use these credentials to test the login functionality:
- Username: `admin`, Password: `1` (Admin role)
- Username: `employee`, Password: `1` (Employee role)
- Username: `citizen`, Password: `1` (Citizen role)

## New Features

1. **User Registration**: New users can register through the registration page at `/register`
2. **Role-based Access**: Users are redirected to different dashboards based on their roles
3. **Environment Configuration**: Uses environment variables for API URLs and database connections
4. **Lightweight Server**: Uses Node.js built-in HTTP module instead of Express

## Security Notes

For production use, you should:
1. Hash passwords before storing in the database
2. Use environment variables for sensitive data
3. Implement proper session management
4. Add input validation and sanitization
5. Implement rate limiting for login attempts
6. Use HTTPS in production