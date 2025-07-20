// Test script to verify form validation
const testValidation = async () => {
  console.log('🧪 Testing form validation...\n');

  // Test 1: Missing required fields
  console.log('Test 1: Missing required fields');
  try {
    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "",
        phone: "",
        email: "",
        privacy: false,
        not_job: false
      }),
    });
    const result = await response.json();
    console.log(response.ok ? '❌ Should have failed' : `✅ Correctly failed: ${result.error}`);
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 2: Invalid phone format
  console.log('\nTest 2: Invalid phone format');
  try {
    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Test User",
        phone: "123", // Invalid format
        city: "Mumbai",
        occupation: "Engineer",
        email: "test@example.com",
        privacy: true,
        not_job: true
      }),
    });
    const result = await response.json();
    console.log(response.ok ? '❌ Should have failed' : `✅ Correctly failed: ${result.error}`);
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 3: Valid submission
  console.log('\nTest 3: Valid submission');
  try {
    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Valid User",
        phone: "+91 98765 43210",
        city: "Delhi",
        occupation: "Manager",
        email: "valid@example.com",
        privacy: true,
        not_job: true,
        age: "35",
        guidance: "Investment",
        industry: "Finance",
        income: "20+ LPA",
        preferred_communication: "Phone",
        consultation_timing: "Morning",
        message: "Looking for financial advice",
        marketing_consent: true
      }),
    });
    const result = await response.json();
    console.log(response.ok ? `✅ Success: ID ${result.id}` : `❌ Failed: ${result.error}`);
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

testValidation();
