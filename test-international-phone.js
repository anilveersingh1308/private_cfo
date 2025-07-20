// International Phone Number Test Script
console.log('🌍 Testing International Phone Number Validation...\n');

const testCases = [
  // Valid cases
  { country: '🇺🇸 US', phone: '+1 555 123 4567', code: '+1', expected: true },
  { country: '🇮🇳 India', phone: '+91 98765 43210', code: '+91', expected: true },
  { country: '🇬🇧 UK', phone: '+44 7700 123456', code: '+44', expected: true },
  { country: '🇦🇺 Australia', phone: '+61 412 345 678', code: '+61', expected: true },
  { country: '🇸🇬 Singapore', phone: '+65 9123 4567', code: '+65', expected: true },
  { country: '🇦🇪 UAE', phone: '+971 50 123 4567', code: '+971', expected: true },
  
  // Invalid cases
  { country: '🇺🇸 US Invalid', phone: '+1 555 12', code: '+1', expected: false },
  { country: '🇮🇳 India Invalid', phone: '+91 987', code: '+91', expected: false },
  { country: '🇬🇧 UK Invalid', phone: '+44 123', code: '+44', expected: false },
];

async function testPhoneValidation() {
  for (const test of testCases) {
    const testData = {
      name: 'Test User',
      phone: test.phone,
      countryCode: test.code,
      city: 'Test City',
      occupation: 'Tester',
      email: 'test@example.com',
      privacy: true,
      not_job: true
    };

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });

      const success = response.ok;
      const result = await response.json();
      
      const status = success === test.expected ? '✅' : '❌';
      console.log(`${status} ${test.country}: ${test.phone} - ${success ? 'Valid' : 'Invalid'}`);
      
      if (!success && test.expected) {
        console.log(`   Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${test.country}: Network error - ${error.message}`);
    }
  }
}

// Country format examples
console.log('\n📱 Supported Country Formats:');
console.log('🇺🇸 United States: +1 555 123 4567');
console.log('🇮🇳 India: +91 98765 43210');
console.log('🇬🇧 United Kingdom: +44 7700 123456');
console.log('🇦🇺 Australia: +61 412 345 678');
console.log('🇸🇬 Singapore: +65 9123 4567');
console.log('🇦🇪 UAE: +971 50 123 4567');
console.log('🇩🇪 Germany: +49 151 12345678');
console.log('🇯🇵 Japan: +81 90 1234 5678');
console.log('🇨🇳 China: +86 138 1234 5678');
console.log('🇫🇷 France: +33 6 12 34 56 78');

console.log('\n🔍 Running validation tests...');
testPhoneValidation();
