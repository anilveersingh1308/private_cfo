// SMS Service for OTP Delivery
// This file handles SMS sending for phone number verification

interface SMSConfig {
  provider: 'twilio' | 'aws-sns' | 'mock';
  accountSid?: string;
  authToken?: string;
  phoneNumber?: string;
  awsAccessKey?: string;
  awsSecretKey?: string;
  awsRegion?: string;
}

interface SMSData {
  to: string;
  message: string;
}

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Configuration - Update this with your SMS service details
const SMS_CONFIG: SMSConfig = {
  provider: process.env.SMS_PROVIDER as any || 'mock', // Change to 'twilio' or 'aws-sns' when configured
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION || 'us-east-1',
};

// Twilio SMS Integration
async function sendWithTwilio(smsData: SMSData): Promise<SMSResult> {
  try {
    // Uncomment when Twilio is configured
    /*
    const twilio = require('twilio');
    const client = twilio(SMS_CONFIG.accountSid, SMS_CONFIG.authToken);

    const message = await client.messages.create({
      body: smsData.message,
      from: SMS_CONFIG.phoneNumber,
      to: smsData.to
    });

    return {
      success: true,
      messageId: message.sid
    };
    */
    
    // Mock implementation until Twilio is configured
    console.log('🔧 Twilio not configured. Install: npm install twilio');
    console.log('📱 Would send SMS to:', smsData.to);
    console.log('📝 Message:', smsData.message);
    
    return {
      success: false,
      error: 'Twilio not configured. Please add TWILIO credentials to environment variables.'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Twilio error'
    };
  }
}

// AWS SNS Integration
async function sendWithAWSSNS(smsData: SMSData): Promise<SMSResult> {
  try {
    // Uncomment when AWS SNS is configured
    /*
    const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
    
    const client = new SNSClient({
      region: SMS_CONFIG.awsRegion,
      credentials: {
        accessKeyId: SMS_CONFIG.awsAccessKey!,
        secretAccessKey: SMS_CONFIG.awsSecretKey!
      }
    });

    const command = new PublishCommand({
      PhoneNumber: smsData.to,
      Message: smsData.message
    });

    const result = await client.send(command);

    return {
      success: true,
      messageId: result.MessageId
    };
    */
    
    // Mock implementation until AWS SNS is configured
    console.log('🔧 AWS SNS not configured. Install: npm install @aws-sdk/client-sns');
    console.log('📱 Would send SMS to:', smsData.to);
    console.log('📝 Message:', smsData.message);
    
    return {
      success: false,
      error: 'AWS SNS not configured. Please add AWS credentials to environment variables.'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'AWS SNS error'
    };
  }
}

// Mock SMS service for testing
async function sendWithMock(smsData: SMSData): Promise<SMSResult> {
  try {
    console.log('📱 Mock SMS Service - Message Details:');
    console.log('   Recipient:', smsData.to);
    console.log('   Message:', smsData.message);
    console.log('   Message Length:', smsData.message.length, 'characters');
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate random success/failure for testing
    const shouldSucceed = Math.random() > 0.15; // 85% success rate
    
    if (shouldSucceed) {
      const messageId = `mock_sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('✅ Mock SMS sent successfully! Message ID:', messageId);
      
      return {
        success: true,
        messageId
      };
    } else {
      console.log('❌ Mock SMS failed (simulated failure)');
      return {
        success: false,
        error: 'Simulated SMS service failure'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Mock SMS service error'
    };
  }
}

// Main SMS sending function
export async function sendSMS(smsData: SMSData): Promise<SMSResult> {
  // Validate SMS data
  if (!smsData.to) {
    return {
      success: false,
      error: 'No recipient phone number specified'
    };
  }

  if (!smsData.message) {
    return {
      success: false,
      error: 'Message content is required'
    };
  }

  // Validate phone number format
  if (!validatePhoneNumber(smsData.to)) {
    return {
      success: false,
      error: 'Invalid phone number format. Use international format (+1234567890)'
    };
  }

  // Route to appropriate SMS service based on configuration
  try {
    switch (SMS_CONFIG.provider) {
      case 'twilio':
        return await sendWithTwilio(smsData);
      
      case 'aws-sns':
        return await sendWithAWSSNS(smsData);
      
      case 'mock':
      default:
        return await sendWithMock(smsData);
    }
  } catch (error) {
    console.error('SMS service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown SMS service error'
    };
  }
}

// Utility function to validate phone numbers
export function validatePhoneNumber(phone: string): boolean {
  // Basic international phone number validation
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

// Utility function to format phone number
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Add + if not present and number doesn't start with +
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

// Generate OTP SMS message template
export function generateOTPSMSMessage(otp: string, purpose: string = 'verification'): string {
  return `Your CFO Newsletter verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;
}

// Export configuration for debugging
export function getSMSConfig() {
  return {
    provider: SMS_CONFIG.provider,
    isConfigured: SMS_CONFIG.provider !== 'mock' && (
      (SMS_CONFIG.provider === 'twilio' && SMS_CONFIG.accountSid && SMS_CONFIG.authToken) ||
      (SMS_CONFIG.provider === 'aws-sns' && SMS_CONFIG.awsAccessKey && SMS_CONFIG.awsSecretKey)
    )
  };
}
