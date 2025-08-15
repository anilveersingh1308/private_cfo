# 🚀 **OTP Delivery Setup Guide**

## **Current Issue**
- Email OTPs are not being delivered (service is in 'mock' mode)
- SMS OTPs are not being sent (service needs provider configuration)

## **Solution: Configure Real Email & SMS Providers**

---

## 📧 **Email Service Configuration**

### **Option 1: SendGrid (Recommended)**

1. **Get SendGrid API Key:**
   - Sign up at https://sendgrid.com/
   - Go to Settings > API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

2. **Add Environment Variable:**
   ```env
   EMAIL_API_KEY=SG.your_sendgrid_api_key_here
   ```

3. **Update Email Service:**
   Edit `lib/email-service.ts` line 26:
   ```typescript
   const EMAIL_CONFIG: EmailConfig = {
     provider: 'sendgrid', // Change from 'mock' to 'sendgrid'
     apiKey: process.env.EMAIL_API_KEY,
   };
   ```

4. **Install SendGrid Package:**
   ```bash
   npm install @sendgrid/mail
   ```

### **Option 2: SMTP (Gmail/Outlook)**

1. **For Gmail - Generate App Password:**
   - Enable 2-factor authentication
   - Go to Google Account > Security > App passwords
   - Generate app password for "Mail"

2. **Add Environment Variables:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Update Email Service:**
   ```typescript
   const EMAIL_CONFIG: EmailConfig = {
     provider: 'smtp',
     smtpHost: process.env.SMTP_HOST,
     smtpPort: parseInt(process.env.SMTP_PORT || '587'),
     smtpUser: process.env.SMTP_USER,
     smtpPass: process.env.SMTP_PASS,
   };
   ```

4. **Install Nodemailer:**
   ```bash
   npm install nodemailer @types/nodemailer
   ```

---

## 📱 **SMS Service Configuration**

### **Option 1: Twilio (Recommended)**

1. **Get Twilio Credentials:**
   - Sign up at https://www.twilio.com/
   - Get Account SID, Auth Token, and Phone Number
   - Copy credentials from Twilio Console

2. **Add Environment Variables:**
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

3. **Install Twilio Package:**
   ```bash
   npm install twilio
   ```

4. **Update SMS Service:**
   Create `lib/sms-service.ts`:
   ```typescript
   import twilio from 'twilio';

   const client = twilio(
     process.env.TWILIO_ACCOUNT_SID,
     process.env.TWILIO_AUTH_TOKEN
   );

   export async function sendSMS(to: string, message: string) {
     try {
       const result = await client.messages.create({
         body: message,
         from: process.env.TWILIO_PHONE_NUMBER,
         to: to
       });
       return { success: true, messageId: result.sid };
     } catch (error) {
       return { success: false, error: error.message };
     }
   }
   ```

### **Option 2: AWS SNS**

1. **Get AWS Credentials:**
   - Sign up at AWS Console
   - Go to IAM > Create User with SNS permissions
   - Get Access Key ID and Secret Access Key

2. **Add Environment Variables:**
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   ```

3. **Install AWS SDK:**
   ```bash
   npm install @aws-sdk/client-sns
   ```

---

## ⚡ **Quick Setup Steps**

### **1. Choose Email Provider**
```bash
# For SendGrid
npm install @sendgrid/mail

# For SMTP
npm install nodemailer @types/nodemailer
```

### **2. Choose SMS Provider**
```bash
# For Twilio
npm install twilio

# For AWS SNS
npm install @aws-sdk/client-sns
```

### **3. Add Environment Variables**
Create `.env.local` file:
```env
# Email Service (choose one)
EMAIL_API_KEY=your_sendgrid_key
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS Service (choose one)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
# OR
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
```

### **4. Update Configuration**
Change `lib/email-service.ts` line 26:
```typescript
provider: 'sendgrid' // or 'smtp'
```

---

## 🧪 **Testing After Setup**

1. **Test Email OTP:**
   - Go to Profile page
   - Enter new email address
   - Click "Send OTP" - should receive real email

2. **Test SMS OTP:**
   - Go to Profile page  
   - Enter new phone number
   - Click "Send OTP" - should receive real SMS

---

## 🔒 **Security Notes**

- Never commit API keys to GitHub
- Use environment variables for all credentials
- Test with your own email/phone first
- Check provider rate limits

---

## 💡 **Recommended Quick Start**

**For immediate testing:**
1. Use **SendGrid** for email (free tier: 100 emails/day)
2. Use **Twilio** for SMS (free trial: $15 credit)
3. Both have good documentation and quick setup

**Total setup time:** 15-20 minutes
