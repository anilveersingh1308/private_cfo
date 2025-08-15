#!/usr/bin/env node

import fetch from 'node-fetch';
import process from 'process';

const BASE_URL = 'http://localhost:3000';

// Test data for different scenarios
const testCases = [
  {
    name: 'Profile Settings - Get Default Settings',
    method: 'GET',
    url: '/api/dashboard/profile/settings',
    headers: {
      'Cookie': 'auth-token=test-token' // This will need a real token
    }
  },
  {
    name: 'Profile Update',
    method: 'PUT', 
    url: '/api/dashboard/profile/update',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'auth-token=test-token'
    },
    body: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      phone: '+91-9876543210'
    })
  },
  {
    name: 'Change Password',
    method: 'PUT',
    url: '/api/dashboard/profile/change-password', 
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'auth-token=test-token'
    },
    body: JSON.stringify({
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123'
    })
  },
  {
    name: 'Update Notifications',
    method: 'PUT',
    url: '/api/dashboard/profile/notifications',
    headers: {
      'Content-Type': 'application/json', 
      'Cookie': 'auth-token=test-token'
    },
    body: JSON.stringify({
      email_notifications: true,
      desktop_notifications: true,
      push_notifications: false,
      invoice_reminders: true,
      consultation_alerts: false,
      marketing_emails: false
    })
  }
];

async function testEndpoint(testCase) {
  try {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log(`   ${testCase.method} ${testCase.url}`);
    
    const options = {
      method: testCase.method,
      headers: testCase.headers || {}
    };
    
    if (testCase.body) {
      options.body = testCase.body;
    }
    
    const response = await fetch(`${BASE_URL}${testCase.url}`, options);
    const responseText = await response.text();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    
    if (response.ok) {
      console.log(`   ✅ Success`);
    } else {
      console.log(`   ❌ Failed`);
    }
    
    return { success: response.ok, status: response.status, response: responseText };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing Profile API Endpoints...\n');
  
  const results = [];
  
  for (const testCase of testCases) {
    const result = await testEndpoint(testCase);
    results.push({ testCase: testCase.name, ...result });
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  let passed = 0;
  let failed = 0;
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.testCase}`);
      passed++;
    } else {
      console.log(`❌ ${result.testCase} - Status: ${result.status || 'Error'}`);
      failed++;
    }
  });
  
  console.log(`\n📈 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n⚠️  Note: Tests may fail due to authentication requirements.');
    console.log('   Visit http://localhost:3000/dashboard/profile in browser to test with real auth.');
  }
}

// Run the tests
runTests().catch(console.error);
