// Test script to verify notification and auto-redirect functionality
const testNotificationSystem = async () => {
  console.log('🔔 Testing notification system...');
  
  // Test successful submission
  const testData = {
    name: "Notification Test User",
    phone: "+91 98765 43210",
    age: "25",
    city: "mumbai",
    occupation: "software_developer",
    guidance: "individual_financial_planning",
    industry: "technology",
    income: "10_15_lakh",
    preferred_communication: "email",
    consultation_timing: "evening_4_7",
    email: "notification.test@example.com",
    message: "Testing notification system",
    privacy: true,
    not_job: true,
    marketing_consent: false
  };

  try {
    console.log('📤 Sending test submission...');
    
    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS: Notification test completed');
      console.log('📝 Response:', result);
      console.log('🆔 Submission ID:', result.id);
      console.log('🔔 Expected behavior:');
      console.log('   - Top-right notification should appear');
      console.log('   - Success message with submission ID');
      console.log('   - Auto-redirect after 5 seconds');
      console.log('   - User should go back to previous page');
    } else {
      console.log('❌ ERROR: Notification test failed');
      console.log('📝 Error:', result.error);
    }

  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }
};

// Run the test
testNotificationSystem();
