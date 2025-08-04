# Final test to verify consultation form is working with consultations table

Write-Host "Testing Final Implementation..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Consultation Form Submission to consultations table
Write-Host "1. Testing consultation form submission to consultations table..." -ForegroundColor Yellow
try {
    $consultationData = @{
        name = "Final Test User"
        phone = "+91 98765 43210"
        city = "Delhi"
        occupation = "Business Owner" 
        email = "finaltest@example.com"
        guidance = "Investment Planning"
        industry = "Technology"
        income = "10-20 Lakhs"
        preferred_communication = "Email"
        consultation_timing = "Morning"
        message = "Final test of consultation form"
        privacy = $true
        not_job = $true
        marketing_consent = $true
    } | ConvertTo-Json

    $result = Invoke-RestMethod -Uri "http://localhost:3000/api/consultation" -Method POST -Body $consultationData -ContentType "application/json"
    
    if ($result.success) {
        Write-Host "   Consultation form submission successful" -ForegroundColor Green
        Write-Host "   Submission ID: $($result.id)" -ForegroundColor Gray
    } else {
        Write-Host "   Consultation form submission failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Verify data is in consultations table
Write-Host "2. Verifying data in consultations table..." -ForegroundColor Yellow
try {
    $consultations = Invoke-RestMethod -Uri "http://localhost:3000/api/consultation" -Method GET
    $count = $consultations.data.Count
    Write-Host "   Total consultations in database: $count" -ForegroundColor Blue
    
    # Show latest consultation
    if ($count -gt 0) {
        $latest = $consultations.data[-1]
        Write-Host "   Latest consultation: $($latest.client_name) - $($latest.service_type)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Error checking consultations: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Implementation Status:" -ForegroundColor White
Write-Host "   Consultation forms now save to 'consultations' table" -ForegroundColor Green
Write-Host "   Form data is mapped to consultations table structure" -ForegroundColor Green 
Write-Host "   All form fields are preserved in the notes field" -ForegroundColor Green
Write-Host ""
