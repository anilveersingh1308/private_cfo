// Test script for consultation form
const testFormSubmission = async () => {
  const testData = {
    name: "Jane Doe",
    phone: "91234 56789",
    city: "Delhi",
    occupation: "Marketing Manager",
    email: "jane.doe@company.com",
    privacy: true,
    not_job: true,
    age: "28",
    guidance: "Investment Strategy",
    industry: "Marketing",
    income: "15-30 Lakhs",
    preferred_communication: "Email",
    consultation_timing: "Afternoon",
    message: "Need guidance on investment portfolio diversification",
    marketing_consent: false
  };

  try {
    const response = await fetch('/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Form submission successful:', result);
      return result;
    } else {
      console.error('❌ Form submission failed:', result);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
};

// Test validation
const testValidation = async () => {
  const invalidData = {
    name: "123Invalid",
    phone: "invalid",
    city: "",
    occupation: "",
    email: "invalid-email",
    privacy: false,
    not_job: false
  };

  try {
    const response = await fetch('/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.log('✅ Validation working correctly:', result.error);
    } else {
      console.error('❌ Validation failed - invalid data was accepted');
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Run tests
console.log('🧪 Testing consultation form submission...');
testFormSubmission();

console.log('🧪 Testing form validation...');
testValidation();
