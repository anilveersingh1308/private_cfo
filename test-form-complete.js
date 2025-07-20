// Comprehensive test for form submission functionality
const testCompleteFormSubmission = async () => {
  console.log('🔬 Comprehensive Form Submission Test');
  console.log('=====================================');
  
  // Test Case 1: Complete form with all fields
  const completeFormData = {
    name: "Complete Form Test User",
    phone: "+91 98765 43210",
    age: "28",
    city: "bangalore",
    occupation: "software_developer",
    guidance: "business_cfo_services",
    industry: "technology",
    income: "15_25_lakh",
    preferred_communication: "video_call",
    consultation_timing: "evening_4_7",
    email: "complete.test@example.com",
    message: "Need comprehensive CFO services for my startup. Looking for financial planning and fundraising support.",
    privacy: true,
    not_job: true,
    marketing_consent: true
  };

  try {
    console.log('📋 Test 1: Complete form submission');
    console.log('Data being sent:', JSON.stringify(completeFormData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completeFormData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS: Complete form submitted successfully');
      console.log('📝 Response:', result);
      console.log('🆔 Database ID:', result.id);
      console.log('📊 Status Code:', response.status);
    } else {
      console.log('❌ ERROR: Complete form submission failed');
      console.log('📝 Error:', result.error);
      console.log('📊 Status Code:', response.status);
    }

  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }

  console.log('\n');

  // Test Case 2: Minimal required fields only
  const minimalFormData = {
    name: "Minimal Test User",
    phone: "+91 87654 32109",
    city: "mumbai",
    occupation: "business_owner",
    email: "minimal.test@example.com",
    privacy: true,
    not_job: true
  };

  try {
    console.log('📋 Test 2: Minimal required fields submission');
    console.log('Data being sent:', JSON.stringify(minimalFormData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalFormData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS: Minimal form submitted successfully');
      console.log('📝 Response:', result);
      console.log('🆔 Database ID:', result.id);
      console.log('📊 Status Code:', response.status);
    } else {
      console.log('❌ ERROR: Minimal form submission failed');
      console.log('📝 Error:', result.error);
      console.log('📊 Status Code:', response.status);
    }

  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }

  console.log('\n');

  // Test Case 3: Invalid data (should fail)
  const invalidFormData = {
    name: "123Invalid Name",
    phone: "invalid phone",
    city: "pune",
    occupation: "engineer",
    email: "invalid-email",
    privacy: true,
    not_job: true
  };

  try {
    console.log('📋 Test 3: Invalid data submission (should fail)');
    console.log('Data being sent:', JSON.stringify(invalidFormData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidFormData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.log('✅ EXPECTED: Invalid form correctly rejected');
      console.log('📝 Error:', result.error);
      console.log('📊 Status Code:', response.status);
    } else {
      console.log('❌ UNEXPECTED: Invalid form was accepted (this should not happen)');
      console.log('📝 Response:', result);
    }

  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }

  console.log('\n📊 Testing Summary:');
  console.log('- Test 1: Complete form with all fields');
  console.log('- Test 2: Minimal form with required fields only');
  console.log('- Test 3: Invalid form data validation');
  console.log('\n🔍 Check server logs for database insertion details');
};

// Run the comprehensive test
testCompleteFormSubmission();
