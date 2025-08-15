#!/usr/bin/env node

/**
 * Quick Setup Script for OTP Services
 * This script helps you configure email and SMS services for OTP delivery
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('🚀 CFO Newsletter - OTP Services Setup');
  console.log('=====================================\n');

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);
  
  if (envExists) {
    console.log('📄 Found existing .env.local file');
    const overwrite = await askQuestion('Do you want to update it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  let envContent = '# CFO Newsletter - OTP Services Configuration\n';
  envContent += '# Generated on ' + new Date().toISOString() + '\n\n';

  // Email Service Setup
  console.log('\n📧 EMAIL SERVICE SETUP');
  console.log('----------------------');
  console.log('Choose your email provider:');
  console.log('1. SendGrid (Recommended - Free tier: 100 emails/day)');
  console.log('2. SMTP (Gmail/Outlook)');
  console.log('3. AWS SES');
  console.log('4. Skip email setup for now');

  const emailChoice = await askQuestion('Enter choice (1-4): ');

  switch (emailChoice) {
    case '1':
      console.log('\n🔑 SendGrid Setup:');
      console.log('1. Sign up at https://sendgrid.com/');
      console.log('2. Go to Settings > API Keys');
      console.log('3. Create API key with "Mail Send" permissions');
      const sendgridKey = await askQuestion('Enter your SendGrid API key: ');
      envContent += '# Email Service (SendGrid)\n';
      envContent += 'EMAIL_PROVIDER=sendgrid\n';
      envContent += `EMAIL_API_KEY=${sendgridKey}\n\n`;
      break;

    case '2':
      console.log('\n📬 SMTP Setup:');
      console.log('For Gmail: Enable 2FA and generate app password');
      const smtpHost = await askQuestion('SMTP Host (e.g., smtp.gmail.com): ');
      const smtpPort = await askQuestion('SMTP Port (587 for Gmail): ');
      const smtpUser = await askQuestion('Email address: ');
      const smtpPass = await askQuestion('Password/App password: ');
      envContent += '# Email Service (SMTP)\n';
      envContent += 'EMAIL_PROVIDER=smtp\n';
      envContent += `SMTP_HOST=${smtpHost}\n`;
      envContent += `SMTP_PORT=${smtpPort}\n`;
      envContent += `SMTP_USER=${smtpUser}\n`;
      envContent += `SMTP_PASS=${smtpPass}\n\n`;
      break;

    case '3':
      console.log('\n☁️ AWS SES Setup:');
      const awsRegion = await askQuestion('AWS Region (e.g., us-east-1): ');
      const awsKey = await askQuestion('AWS Access Key: ');
      const awsSecret = await askQuestion('AWS Secret Key: ');
      envContent += '# Email Service (AWS SES)\n';
      envContent += 'EMAIL_PROVIDER=ses\n';
      envContent += `AWS_SES_REGION=${awsRegion}\n`;
      envContent += `AWS_SES_ACCESS_KEY=${awsKey}\n`;
      envContent += `AWS_SES_SECRET_KEY=${awsSecret}\n\n`;
      break;

    default:
      envContent += '# Email Service (Mock - for testing only)\n';
      envContent += 'EMAIL_PROVIDER=mock\n\n';
      break;
  }

  // SMS Service Setup
  console.log('\n📱 SMS SERVICE SETUP');
  console.log('--------------------');
  console.log('Choose your SMS provider:');
  console.log('1. Twilio (Recommended - Free trial: $15 credit)');
  console.log('2. AWS SNS');
  console.log('3. Skip SMS setup for now');

  const smsChoice = await askQuestion('Enter choice (1-3): ');

  switch (smsChoice) {
    case '1':
      console.log('\n📞 Twilio Setup:');
      console.log('1. Sign up at https://www.twilio.com/');
      console.log('2. Get Account SID, Auth Token from Console');
      console.log('3. Get a Twilio phone number');
      const twilioSid = await askQuestion('Account SID: ');
      const twilioToken = await askQuestion('Auth Token: ');
      const twilioPhone = await askQuestion('Twilio Phone Number (+1234567890): ');
      envContent += '# SMS Service (Twilio)\n';
      envContent += 'SMS_PROVIDER=twilio\n';
      envContent += `TWILIO_ACCOUNT_SID=${twilioSid}\n`;
      envContent += `TWILIO_AUTH_TOKEN=${twilioToken}\n`;
      envContent += `TWILIO_PHONE_NUMBER=${twilioPhone}\n\n`;
      break;

    case '2':
      console.log('\n☁️ AWS SNS Setup:');
      const snsRegion = await askQuestion('AWS Region (e.g., us-east-1): ');
      const snsKey = await askQuestion('AWS Access Key: ');
      const snsSecret = await askQuestion('AWS Secret Key: ');
      envContent += '# SMS Service (AWS SNS)\n';
      envContent += 'SMS_PROVIDER=aws-sns\n';
      envContent += `AWS_ACCESS_KEY_ID=${snsKey}\n`;
      envContent += `AWS_SECRET_ACCESS_KEY=${snsSecret}\n`;
      envContent += `AWS_REGION=${snsRegion}\n\n`;
      break;

    default:
      envContent += '# SMS Service (Mock - for testing only)\n';
      envContent += 'SMS_PROVIDER=mock\n\n';
      break;
  }

  // Write .env.local file
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Configuration saved to .env.local');
  console.log('\n📦 Next steps:');
  
  if (emailChoice === '1') {
    console.log('   • Install SendGrid: npm install @sendgrid/mail');
  } else if (emailChoice === '2') {
    console.log('   • Install Nodemailer: npm install nodemailer @types/nodemailer');
  }
  
  if (smsChoice === '1') {
    console.log('   • Install Twilio: npm install twilio');
  } else if (smsChoice === '2') {
    console.log('   • Install AWS SDK: npm install @aws-sdk/client-sns');
  }

  console.log('   • Restart your development server');
  console.log('   • Test OTP functionality in the profile page');

  console.log('\n🧪 Testing:');
  console.log('   • Go to Dashboard > Profile');
  console.log('   • Try changing email/phone number');
  console.log('   • Check console logs for delivery status');

  rl.close();
}

main().catch(console.error);
