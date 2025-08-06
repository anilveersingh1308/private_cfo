# Private CFO Dashboard

A comprehensive dashboard application for managing CFO services, built with Next.js, Drizzle ORM, and Neon PostgreSQL.

## 🚀 Features

- **Admin Dashboard**: Complete overview of consultations, users, and analytics
- **Authentication System**: Secure JWT-based authentication with role-based access
- **Consultation Management**: View and manage client consultation requests
- **User Management**: Manage CFO service providers and administrators
- **Real-time Statistics**: Live dashboard metrics and analytics
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with HTTP-only cookies
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- A Neon PostgreSQL database account
- Git

## ⚡ Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd private-cfo
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database - Replace with your Neon database URL
DATABASE_URL='postgresql://username:password@your-neon-instance.neon.tech/dbname?sslmode=require'

# JWT Secret - Change this in production
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024

# Application Settings
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

### 3. Database Setup

```bash
# Initialize the database with default users
npm run db:init

# Create sample consultation data (optional)
npm run db:sample

# View database in Drizzle Studio (optional)
npm run db:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Default Login Credentials

After running `npm run db:init`, you can use these credentials:

⚠️ **Important**: Change these passwords in production!

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start development server on port 3000
npm run dev:3001         # Start on port 3001
npm run dev:4000         # Start on port 4000

# Production
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:init         # Initialize database with default users
npm run db:sample       # Create sample consultation data
npm run db:generate     # Generate database migrations
npm run db:migrate      # Run database migrations
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Drizzle Studio

# Utilities
npm run lint           # Run ESLint
npm run check-port     # Check if port 3000 is available
```

## 🏗️ Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin-only pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── auth-context.tsx  # Auth React context
│   ├── db.ts             # Database connection
│   └── schema.ts         # Database schema
├── scripts/              # Database initialization scripts
├── drizzle/              # Database migrations
└── public/               # Static assets
```

## 🔧 Database Schema

### Users Table
- **Role-based access**: admin, financial_advisor, tax_consultant, investment_advisor, business_consultant
- **User profiles**: Name, email, phone, specialization, experience
- **Authentication**: Secure password hashing with bcrypt

### Consultations Table
- **Client information**: Name, contact details, demographics
- **Consultation details**: Type of guidance needed, industry, income level
- **Status tracking**: pending, assigned, completed, cancelled
- **Assignment system**: Link consultations to specific CFO providers

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Post-deployment**:
   ```bash
   # Initialize production database
   npm run db:init
   ```

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
DATABASE_URL=your-production-neon-url
JWT_SECRET=your-production-jwt-secret
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: Granular permission system
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM

## 📖 API Documentation

### Authentication Endpoints

- `POST /api/auth` - Login user
- `DELETE /api/auth` - Logout user
- `GET /api/auth/verify` - Verify token

### Dashboard Endpoints

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/consultations` - Get all consultations (admin only)
- `GET /api/admin/users` - Get all users (admin only)

### Consultation Endpoints

- `POST /api/consultation` - Submit new consultation
- `GET /api/consultation` - Get consultations (public endpoint)

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify your DATABASE_URL in `.env.local`
   - Ensure your Neon database is accessible
   - Check if the database exists

2. **Authentication Issues**:
   - Verify JWT_SECRET is set
   - Clear browser cookies and try again
   - Check if users exist in database

3. **Port Already in Use**:
   ```bash
   npm run check-port      # Check port availability
   npm run dev:3001        # Use alternative port
   ```

### Development Tips

- Use `npm run db:studio` to inspect your database
- Check browser console for frontend errors
- Monitor terminal for backend logs
- Use network tab to debug API calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support, email your development team or create an issue in the repository.

---

**🎉 Your Private CFO Dashboard is ready!** 

Access the admin panel at [http://localhost:3000/sign-in](http://localhost:3000/sign-in) using the default credentials above.
