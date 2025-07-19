# CFO Dashboard Startup Script for Windows
# Usage: .\start.ps1 [port]
# Example: .\start.ps1 3000

param(
    [int]$Port = 3000,
    [switch]$Production = $false
)

Write-Host "🚀 Starting CFO Dashboard on port $Port..." -ForegroundColor Green

# Set environment variables
$env:PORT = $Port
$env:NEXT_PUBLIC_APP_URL = "http://localhost:$Port"

if ($Production) {
    Write-Host "📦 Starting in production mode..." -ForegroundColor Yellow
    $env:NODE_ENV = "production"
    npm run build
    if ($LASTEXITCODE -eq 0) {
        npm run start -- -p $Port
    } else {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "🔧 Starting in development mode..." -ForegroundColor Cyan
    npm run dev -- -p $Port
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start the server!" -ForegroundColor Red
    exit 1
}
