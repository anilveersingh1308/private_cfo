# Test script to verify consultation and newsletter forms are working

Write-Host "Testing Consultation and Newsletter Forms..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Database Connection
Write-Host "1. Testing database connection..." -ForegroundColor Yellow
try {
    $dbTest = Invoke-RestMethod -Uri "http://localhost:3000/api/test-db" -Method GET
    if ($dbTest.success) {
        Write-Host "   Database connection successful" -ForegroundColor Green
    } else {
        Write-Host "   Database connection failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   Could not connect to database: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Consultation Form Submission
Write-Host "2. Testing consultation form submission..." -ForegroundColor Yellow
try {
    $consultationData = @{
        name = "John Doe"
        phone = "+91 98765 43210"
        city = "Mumbai"
        occupation = "Business Owner"
        email = "johndoe@example.com"
        guidance = "Investment Planning"
        industry = "Technology"
        income = "10-20 Lakhs"
        preferred_communication = "Email"
        consultation_timing = "Morning"
        message = "Looking for comprehensive financial planning"
        privacy = $true
        not_job = $true
        marketing_consent = $true
    } | ConvertTo-Json

    $consultationResult = Invoke-RestMethod -Uri "http://localhost:3000/api/consultation" -Method POST -Body $consultationData -ContentType "application/json"
    
    if ($consultationResult.success) {
        Write-Host "   Consultation form submission successful" -ForegroundColor Green
    } else {
        Write-Host "   Consultation form submission failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   Consultation form error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Newsletter Subscription
Write-Host "3. Testing newsletter subscription..." -ForegroundColor Yellow
try {
    $newsletterData = @{
        email = "newsletter.test2@example.com"
        categories = @("Financial Tips", "Investment Insights", "Tax Planning")
        source = "Test Script"
    } | ConvertTo-Json

    $newsletterResult = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/subscribers" -Method POST -Body $newsletterData -ContentType "application/json"
    
    if ($newsletterResult.success) {
        Write-Host "   Newsletter subscription successful" -ForegroundColor Green
    } else {
        Write-Host "   Newsletter subscription failed: $($newsletterResult.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   Newsletter subscription error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Form testing completed!" -ForegroundColor Cyan
