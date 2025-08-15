// Email Service Configuration
// This file contains email service integrations that you can customize
// based on your preferred email provider (SendGrid, AWS SES, Mailgun, etc.)

interface EmailConfig {
  provider: 'sendgrid' | 'ses' | 'mailgun' | 'smtp' | 'mock';
  apiKey?: string;
  region?: string;
  domain?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
}

interface EmailData {
  to: string[];
  subject: string;
  content: string;
  isHtml?: boolean;
  from?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Configuration - Update this with your email service details
const EMAIL_CONFIG: EmailConfig = {
  provider: process.env.EMAIL_PROVIDER as any || 'mock', // Change to your preferred provider
  apiKey: process.env.EMAIL_API_KEY,
  region: process.env.AWS_SES_REGION || process.env.AWS_REGION,
  domain: process.env.MAILGUN_DOMAIN,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
};

// Default sender information
const DEFAULT_FROM = {
  email: 'noreply@yourcfocompany.com',
  name: 'CFO Newsletter'
};

// SendGrid Integration
async function sendWithSendGrid(emailData: EmailData): Promise<EmailResult> {
  try {
    // Uncomment and configure when using SendGrid
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(EMAIL_CONFIG.apiKey);

    const msg = {
      to: emailData.to,
      from: `${DEFAULT_FROM.name} <${DEFAULT_FROM.email}>`,
      subject: emailData.subject,
      [emailData.isHtml ? 'html' : 'text']: emailData.content,
    };

    const response = await sgMail.sendMultiple(msg);
    return {
      success: true,
      messageId: response[0].headers['x-message-id']
    };
    */
    
    throw new Error('SendGrid not configured');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SendGrid error'
    };
  }
}

// AWS SES Integration
async function sendWithSES(emailData: EmailData): Promise<EmailResult> {
  try {
    // Uncomment and configure when using AWS SES
    /*
    const AWS = require('aws-sdk');
    const ses = new AWS.SES({ region: EMAIL_CONFIG.region });

    const params = {
      Source: `${DEFAULT_FROM.name} <${DEFAULT_FROM.email}>`,
      Destination: {
        ToAddresses: emailData.to
      },
      Message: {
        Subject: {
          Data: emailData.subject,
          Charset: 'UTF-8'
        },
        Body: emailData.isHtml ? {
          Html: {
            Data: emailData.content,
            Charset: 'UTF-8'
          }
        } : {
          Text: {
            Data: emailData.content,
            Charset: 'UTF-8'
          }
        }
      }
    };

    const result = await ses.sendEmail(params).promise();
    return {
      success: true,
      messageId: result.MessageId
    };
    */
    
    throw new Error('AWS SES not configured');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'AWS SES error'
    };
  }
}

// Mailgun Integration
async function sendWithMailgun(emailData: EmailData): Promise<EmailResult> {
  try {
    // Uncomment and configure when using Mailgun
    /*
    const mailgun = require('mailgun-js')({
      apiKey: EMAIL_CONFIG.apiKey,
      domain: EMAIL_CONFIG.domain
    });

    const data = {
      from: `${DEFAULT_FROM.name} <${DEFAULT_FROM.email}>`,
      to: emailData.to.join(', '),
      subject: emailData.subject,
      [emailData.isHtml ? 'html' : 'text']: emailData.content
    };

    const result = await mailgun.messages().send(data);
    return {
      success: true,
      messageId: result.id
    };
    */
    
    throw new Error('Mailgun not configured');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Mailgun error'
    };
  }
}

// SMTP Integration (using Nodemailer)
async function sendWithSMTP(emailData: EmailData): Promise<EmailResult> {
  try {
    // Uncomment and configure when using SMTP
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: EMAIL_CONFIG.smtpHost,
      port: EMAIL_CONFIG.smtpPort,
      secure: EMAIL_CONFIG.smtpPort === 465,
      auth: {
        user: EMAIL_CONFIG.smtpUser,
        pass: EMAIL_CONFIG.smtpPass
      }
    });

    const mailOptions = {
      from: `${DEFAULT_FROM.name} <${DEFAULT_FROM.email}>`,
      to: emailData.to.join(', '),
      subject: emailData.subject,
      [emailData.isHtml ? 'html' : 'text']: emailData.content
    };

    const result = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: result.messageId
    };
    */
    
    throw new Error('SMTP not configured');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SMTP error'
    };
  }
}

// Mock Email Service (for development/testing)
async function sendWithMock(emailData: EmailData): Promise<EmailResult> {
  try {
    console.log('📧 Mock Email Service - Email Details:');
    console.log('   Recipients:', emailData.to);
    console.log('   Subject:', emailData.subject);
    console.log('   Content Type:', emailData.isHtml ? 'HTML' : 'Plain Text');
    console.log('   Content Length:', emailData.content.length, 'characters');
    console.log('   Preview:', emailData.content.substring(0, 100) + '...');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random success/failure for testing
    const shouldSucceed = Math.random() > 0.1; // 90% success rate
    
    if (shouldSucceed) {
      const messageId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('✅ Mock email sent successfully! Message ID:', messageId);
      
      return {
        success: true,
        messageId
      };
    } else {
      console.log('❌ Mock email failed (simulated failure)');
      return {
        success: false,
        error: 'Simulated email service failure'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Mock service error'
    };
  }
}

// Main email sending function
export async function sendEmail(emailData: EmailData): Promise<EmailResult> {
  // Validate email data
  if (!emailData.to || emailData.to.length === 0) {
    return {
      success: false,
      error: 'No recipients specified'
    };
  }

  if (!emailData.subject || !emailData.content) {
    return {
      success: false,
      error: 'Subject and content are required'
    };
  }

  // Route to appropriate email service based on configuration
  try {
    switch (EMAIL_CONFIG.provider) {
      case 'sendgrid':
        return await sendWithSendGrid(emailData);
      
      case 'ses':
        return await sendWithSES(emailData);
      
      case 'mailgun':
        return await sendWithMailgun(emailData);
      
      case 'smtp':
        return await sendWithSMTP(emailData);
      
      case 'mock':
      default:
        return await sendWithMock(emailData);
    }
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email service error'
    };
  }
}

// Utility function to validate email addresses
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to batch process emails (to avoid rate limits)
export async function sendBatchEmails(
  emailDataList: EmailData[],
  batchSize: number = 10,
  delayMs: number = 1000
): Promise<EmailResult[]> {
  const results: EmailResult[] = [];
  
  for (let i = 0; i < emailDataList.length; i += batchSize) {
    const batch = emailDataList.slice(i, i + batchSize);
    const batchPromises = batch.map(emailData => sendEmail(emailData));
    const batchResults = await Promise.all(batchPromises);
    
    results.push(...batchResults);
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < emailDataList.length && delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
}

/*
  SETUP INSTRUCTIONS:
  
  1. Choose your email provider and update EMAIL_CONFIG.provider
  
  2. Install the required package for your provider:
     - SendGrid: npm install @sendgrid/mail
     - AWS SES: npm install aws-sdk
     - Mailgun: npm install mailgun-js
     - SMTP: npm install nodemailer
  
  3. Add environment variables to your .env.local:
     - SendGrid: EMAIL_API_KEY=your_sendgrid_api_key
     - AWS SES: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
     - Mailgun: EMAIL_API_KEY=your_mailgun_api_key, MAILGUN_DOMAIN=your_domain
     - SMTP: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  
  4. Uncomment the relevant service function above
  
  5. Update DEFAULT_FROM with your actual email details
  
  6. Test with the mock service first, then switch to your chosen provider
*/
