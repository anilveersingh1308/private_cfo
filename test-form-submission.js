// Test script to verify form submission works correctly
const testSubmission = async () => {
  const testData = {
    name: "Test User",
    phone: "+91 98765 43210",
    age: "30",
    city: "Mumbai",
    occupation: "Software Engineer",
    guidance: "Financial Planning",
    industry: "Technology",
    income: "10-20 LPA",
    preferred_communication: "Email",
    consultation_timing: "Evening",
    email: "test@example.com",
    message: "Looking for investment guidance",
    privacy: true,
    not_job: true,
    marketing_consent: false
  };

  try {
    console.log('Testing consultation form submission...');
    console.log('Test data:', testData);

    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS: Form submission completed');
      console.log('Response:', result);
      console.log('Submission ID:', result.id);
    } else {
      console.log('❌ ERROR: Form submission failed');
      console.log('Error:', result.error);
      console.log('Status:', response.status);
    }

  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }
};

// Run the test
testSubmission();
