@echo off
REM CFO Dashboard Startup Script for Windows Batch
REM Usage: start.bat [port] [mode]
REM Example: start.bat 3000 dev

set DEFAULT_PORT=3000
set PORT=%1
set MODE=%2

if "%PORT%"=="" set PORT=%DEFAULT_PORT%
if "%MODE%"=="" set MODE=dev

echo 🚀 Starting CFO Dashboard on port %PORT% in %MODE% mode...

set "NEXT_PUBLIC_APP_URL=http://localhost:%PORT%"

if "%MODE%"=="prod" (
    echo 📦 Building for production...
    call npm run build
    if errorlevel 1 (
        echo ❌ Build failed!
        pause
        exit /b 1
    )
    echo 🌐 Starting production server...
    call npm run start -- -p %PORT%
) else (
    echo 🔧 Starting development server...
    call npm run dev -- -p %PORT%
)

if errorlevel 1 (
    echo ❌ Failed to start server!
    pause
    exit /b 1
)

pause
