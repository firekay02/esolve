const nodemailer = require('nodemailer');

// Check if required environment variables are present
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn('⚠️  Email service disabled: Missing environment variables:', missingEnvVars.join(', '));
  console.warn('📝 Please create a .env file in the backend directory and configure email settings');
  
  // Export disabled email functions
  module.exports = {
    sendEmail: async () => { throw new Error('Email service not configured'); },
    sendWelcomeEmail: async () => { throw new Error('Email service not configured'); },
    sendSessionConfirmationEmail: async () => { throw new Error('Email service not configured'); },
    sendSessionAssignmentEmail: async () => { throw new Error('Email service not configured'); },
    sendSessionReminderEmail: async () => { throw new Error('Email service not configured'); },
    sendSessionCompletedEmail: async () => { throw new Error('Email service not configured'); }
  };
  return;
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    console.error('💡 Make sure your .env file has correct EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS values');
    if (error.code === 'ESOCKET') {
      console.error('🔧 Connection refused - check if EMAIL_HOST is correct (e.g., smtp.gmail.com)');
    }
  } else {
    console.log('✅ Email service is ready');
  }
});

const sendEmail = async (to, subject, html, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"FixItNow Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('📧 Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to FixItNow!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1e40af;">Welcome to FixItNow, ${name}!</h1>
      <p>Thank you for joining our remote tech support platform. We're here to help you with all your technology needs.</p>
      
      <h2>What's Next?</h2>
      <ul>
        <li>Book your first support session</li>
        <li>Explore our knowledge base</li>
        <li>Contact us anytime for help</li>
      </ul>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Need Help Getting Started?</h3>
        <p>Our support team is available 24/7 to assist you:</p>
        <ul>
          <li>📞 Phone: 1-800-FIX-NOW</li>
          <li>📧 Email: support@fixitnow.com</li>
          <li>💬 Live Chat: Available on our website</li>
        </ul>
      </div>
      
      <p>Best regards,<br>The FixItNow Team</p>
    </div>
  `;
  
  const text = `Welcome to FixItNow, ${name}! Thank you for joining our remote tech support platform. We're here to help you with all your technology needs.`;
  
  return sendEmail(email, subject, html, text);
};

const sendSessionConfirmationEmail = async (email, name, session) => {
  const subject = `Session Confirmation - ${session.issue_type}`;
  const scheduledTime = new Date(session.scheduled_time).toLocaleString();
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1e40af;">Session Confirmed!</h1>
      <p>Hi ${name},</p>
      <p>Your tech support session has been successfully booked. Here are the details:</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Session Details</h3>
        <p><strong>Session ID:</strong> #${session.id}</p>
        <p><strong>Issue Type:</strong> ${session.issue_type}</p>
        <p><strong>Scheduled Time:</strong> ${scheduledTime}</p>
        <p><strong>Status:</strong> ${session.status}</p>
        <p><strong>Priority:</strong> ${session.urgency}</p>
      </div>
      
      <h3>What Happens Next?</h3>
      <ol>
        <li>We'll assign a certified technician to your case</li>
        <li>You'll receive an email with technician details and connection instructions</li>
        <li>At the scheduled time, click the provided link to start your session</li>
      </ol>
      
      <p>If you need to reschedule or have any questions, please contact us at support@fixitnow.com</p>
      
      <p>Best regards,<br>The FixItNow Team</p>
    </div>
  `;
  
  const text = `Session Confirmed! Your tech support session for "${session.issue_type}" has been booked for ${scheduledTime}. Session ID: #${session.id}`;
  
  return sendEmail(email, subject, html, text);
};

const sendSessionAssignmentEmail = async (customerEmail, customerName, technicianName, session) => {
  const subject = `Technician Assigned - Session #${session.id}`;
  const scheduledTime = new Date(session.scheduled_time).toLocaleString();
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1e40af;">Technician Assigned!</h1>
      <p>Hi ${customerName},</p>
      <p>Great news! We've assigned a certified technician to your support session.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Session Details</h3>
        <p><strong>Session ID:</strong> #${session.id}</p>
        <p><strong>Technician:</strong> ${technicianName}</p>
        <p><strong>Issue:</strong> ${session.issue_type}</p>
        <p><strong>Scheduled Time:</strong> ${scheduledTime}</p>
      </div>
      
      <h3>Before Your Session</h3>
      <ul>
        <li>Ensure your device is connected to the internet</li>
        <li>Close any sensitive applications or documents</li>
        <li>Have your session ID ready: #${session.id}</li>
      </ul>
      
      <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Connection Link:</strong> You'll receive the secure connection link 15 minutes before your scheduled session.</p>
      </div>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>The FixItNow Team</p>
    </div>
  `;
  
  const text = `Technician Assigned! ${technicianName} has been assigned to your session #${session.id} scheduled for ${scheduledTime}.`;
  
  return sendEmail(customerEmail, subject, html, text);
};

const sendSessionReminderEmail = async (email, name, session, remoteLink) => {
  const subject = `Session Starting Soon - #${session.id}`;
  const scheduledTime = new Date(session.scheduled_time).toLocaleString();
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1e40af;">Your Session Starts Soon!</h1>
      <p>Hi ${name},</p>
      <p>Your tech support session is starting in 15 minutes.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Session Details</h3>
        <p><strong>Session ID:</strong> #${session.id}</p>
        <p><strong>Issue:</strong> ${session.issue_type}</p>
        <p><strong>Time:</strong> ${scheduledTime}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${remoteLink}" style="background-color: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Join Session Now
        </a>
      </div>
      
      <h3>Important Reminders</h3>
      <ul>
        <li>Click the link above to start your session</li>
        <li>You'll be asked to grant screen sharing permissions</li>
        <li>Your technician will guide you through the process</li>
        <li>You can end the session at any time</li>
      </ul>
      
      <p>Need help? Contact us at support@fixitnow.com</p>
      
      <p>Best regards,<br>The FixItNow Team</p>
    </div>
  `;
  
  const text = `Your session #${session.id} starts in 15 minutes. Join here: ${remoteLink}`;
  
  return sendEmail(email, subject, html, text);
};

const sendSessionCompletedEmail = async (email, name, session) => {
  const subject = `Session Completed - #${session.id}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10b981;">Session Completed!</h1>
      <p>Hi ${name},</p>
      <p>Your tech support session has been successfully completed.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Session Summary</h3>
        <p><strong>Session ID:</strong> #${session.id}</p>
        <p><strong>Issue:</strong> ${session.issue_type}</p>
        <p><strong>Status:</strong> Completed</p>
      </div>
      
      <h3>What's Next?</h3>
      <ul>
        <li>Test the solution to ensure everything works properly</li>
        <li>Rate your experience and leave feedback</li>
        <li>Contact us if you need any follow-up support</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/feedback/${session.id}" style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Rate Your Experience
        </a>
      </div>
      
      <p>Thank you for choosing FixItNow!</p>
      
      <p>Best regards,<br>The FixItNow Team</p>
    </div>
  `;
  
  const text = `Your session #${session.id} has been completed. Please rate your experience at ${process.env.FRONTEND_URL}/feedback/${session.id}`;
  
  return sendEmail(email, subject, html, text);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendSessionConfirmationEmail,
  sendSessionAssignmentEmail,
  sendSessionReminderEmail,
  sendSessionCompletedEmail
};