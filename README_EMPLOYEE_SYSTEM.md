# Private CFO - Employee Consultation Tracking System

## Overview

This project has been enhanced to support **employee consultation tracking** where:

- **Employees** can track and manage their assigned consultations
- **Admins** can oversee all employees and their consultation records
- **Comprehensive tracking** of consultation sessions, notes, and performance metrics

## Features

### For Employees:
- **Personal Dashboard** - View personal consultation statistics and upcoming sessions
- **Consultation Management** - Update consultation status, add notes, schedule sessions
- **Session Tracking** - Track consultation sessions with clients
- **Performance Metrics** - View personal performance statistics

### For Admins:
- **Employee Management** - Manage employee accounts and permissions
- **Consultation Oversight** - View and manage all consultations across employees
- **Analytics Dashboard** - Overview of company-wide consultation metrics
- **Employee Statistics** - Track individual employee performance

### Enhanced Database Schema:
- **Enhanced Consultations** - Added priority, status tracking, fees, ratings
- **Consultation Notes** - Track detailed notes and updates for each consultation
- **Consultation Sessions** - Schedule and track individual sessions
- **Employee Statistics** - Monthly performance tracking for employees

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Run the setup script to create tables and admin user:
```bash
node scripts/setup-database.mjs
```

This will:
- Create all necessary database tables
- Create a default admin user with credentials:
  - **Email**: `admin@privatecfo.com`
  - **Password**: `admin123` ⚠️ **Change this immediately after first login!**

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
- **Website**: http://localhost:3000
- **Employee Login**: http://localhost:3000/sign-in
- **Admin Portal**: Login as admin and access admin features

## User Roles

### Admin (`admin`)
- Full access to all consultations
- Employee management
- System analytics and reports
- Can assign consultations to employees

### Financial Advisor (`financial_advisor`)
- View and manage assigned consultations
- Track personal performance
- Schedule consultation sessions
- Add consultation notes

### Other Roles
- `tax_consultant`
- `investment_advisor` 
- `business_consultant`

All non-admin roles have the same permissions as financial advisors.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Consultations
- `GET /api/consultations` - List consultations (filtered by role)
- `PATCH /api/consultations` - Update consultation
- `POST /api/consultation` - Create new consultation (existing)

### Employee Management
- `GET /api/users` - List employees (admin only)
- `PATCH /api/users` - Update employee (admin only)

### Statistics & Analytics
- `GET /api/dashboard` - Dashboard data (role-based)
- `GET /api/employee-stats` - Employee statistics
- `POST /api/employee-stats` - Recalculate stats (admin only)

### Consultation Tracking
- `GET /api/consultation-notes` - Get consultation notes
- `POST /api/consultation-notes` - Add consultation note
- `GET /api/consultation-sessions` - Get consultation sessions
- `POST /api/consultation-sessions` - Schedule session
- `PATCH /api/consultation-sessions` - Update session

## Database Schema

### Key Tables:
1. **users** - Employee accounts and authentication
2. **consultations** - Enhanced consultation records
3. **consultation_notes** - Detailed tracking notes
4. **consultation_sessions** - Scheduled consultation sessions
5. **employee_stats** - Monthly performance statistics

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate migrations
npm run db:migrate      # Apply migrations
npm run db:push         # Push schema changes
npm run db:studio       # Open Drizzle Studio

# Setup
node scripts/setup-database.mjs  # Setup database and admin user
```

## Security Notes

1. **Change Default Password**: Immediately change the admin password after first login
2. **JWT Secret**: Update `JWT_SECRET` in `.env.local` for production
3. **Database**: Secure your database credentials
4. **Environment Variables**: Never commit `.env.local` to version control

## Usage Flow

### For New Employees:
1. Admin creates employee account through registration or admin panel
2. Employee receives login credentials
3. Employee logs in and accesses personal dashboard
4. Employee can view assigned consultations and manage them

### For Admins:
1. Login with admin credentials
2. Access admin dashboard for overview
3. Manage employees through user management
4. Assign consultations to employees
5. Monitor performance through analytics

### Consultation Workflow:
1. Client submits consultation request (existing functionality)
2. Admin assigns consultation to appropriate employee
3. Employee receives notification and can see it in their dashboard
4. Employee manages consultation through its lifecycle:
   - Schedule sessions
   - Add notes and updates
   - Track progress
   - Mark as completed
   - Request follow-ups if needed

## Production Deployment

1. Set secure environment variables
2. Update database connection string
3. Build the application: `npm run build`
4. Deploy to your hosting platform
5. Run database setup script on production database
6. Test authentication and functionality

## Support

The system now provides comprehensive consultation tracking capabilities suitable for both individual employee productivity and administrative oversight. The role-based access ensures data security while providing appropriate functionality for each user type.
