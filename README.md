# CFO Dashboard

A comprehensive financial dashboard built with Next.js, React, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

## 🏃‍♂️ Running the Project

### Default Port (3000) - Windows Compatible
```bash
npm run dev
```

### Specific Ports (Windows Compatible)
```bash
# Run on port 3000
npm run dev:3000

# Run on port 3001  
npm run dev:3001

# Run on port 4000
npm run dev:4000

# Run using the flexible startup script (any port)
npm run dev:port
node start.js -p 3002
node start.js --port=4000
```

### Environment Variable Method (Cross-Platform)
```bash
# Using cross-env (works on Windows)
cross-env PORT=8080 npm run dev

# Using start.js script with custom port
node start.js -p 8080
```

### Windows PowerShell
```powershell
# Run on default port (3000)
.\start.ps1

# Run on specific port
.\start.ps1 3001

# Run in production mode
.\start.ps1 3000 -Production
```

### Windows Batch
```cmd
# Run on specific port
start.bat 3000 dev
start.bat 4000 prod
```

## 🌍 Environment Variables

Create a `.env.local` file:

```bash
# Database
DATABASE_URL=your_database_url

# Port Configuration (optional, defaults to 3000)
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Other
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

## 📱 Features

- **Responsive Dashboard**: Beautiful financial overview with cards and charts
- **Navigation**: Desktop and mobile-friendly navigation
- **Port Flexibility**: Run on any port with multiple configuration options
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **TypeScript**: Full type safety

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (default port) |
| `npm run dev:3000` | Start on port 3000 |
| `npm run dev:3001` | Start on port 3001 |
| `npm run dev:4000` | Start on port 4000 |
| `npm run dev:port` | Start with flexible port configuration |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run start:port` | Start production with flexible port |
| `npm run serve` | Universal start script |
| `npm run lint` | Run ESLint |

## 🎯 Port Configuration Priority

1. Command line arguments (`-p` or `--port`)
2. Environment variable (`PORT`)
3. Default port (3000)

## 🏗️ Tech Stack

- **Framework**: Next.js 15
- **UI**: React 19, Tailwind CSS, Radix UI
- **Icons**: Lucide React
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel-ready

## 📝 Usage Examples

```bash
# Development on different ports
npm run dev              # http://localhost:3000
PORT=3001 npm run dev    # http://localhost:3001
npm run dev:4000         # http://localhost:4000

# Production
npm run build
npm run start            # http://localhost:3000
PORT=8080 npm run start  # http://localhost:8080

# Windows
.\start.ps1 3000         # http://localhost:3000
.\start.ps1 8080 -Production  # Production on port 8080
```

## 🔧 Troubleshooting

### Port Already in Use
If you get a "port already in use" error, try:
- Use a different port: `PORT=3001 npm run dev`
- Kill existing processes: `npx kill-port 3000`
- Use the Windows script: `.\start.ps1 3001`

### Permission Issues on Windows
If you can't run PowerShell scripts:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📄 License

This project is private and proprietary.
