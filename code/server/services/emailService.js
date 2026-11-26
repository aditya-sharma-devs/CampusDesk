/**
 * Email Service for CampusDesk (Thapar University)
 * Handles transactional emails including new user welcome emails.
 * Supports Resend, Brevo (Sendinblue), SendGrid, and Nodemailer (SMTP/Gmail).
 */

const nodemailer = require('nodemailer');

/**
 * Generate responsive HTML template for CampusDesk Welcome Email
 */
function getWelcomeEmailHtml({ name, email, role, batch }) {
  const roleDisplay = role === 'FACULTY_ORGANISATION' ? 'Faculty / Instructor' : 'Student';
  const batchDisplay = role === 'STUDENT' ? (batch ? `Batch ${batch}` : 'Assigned Batch') : 'Academic Department';
  const portalUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CampusDesk</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 15px;
    }
    .card {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #a91d22 0%, #801217 100%);
      padding: 36px 32px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0 0 6px 0;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 0;
      font-size: 13px;
      color: #fed7aa;
      font-weight: 500;
    }
    .body {
      padding: 36px 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .text {
      font-size: 14px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 24px;
    }
    .info-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 13px;
      border-bottom: 1px solid #edf2f7;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #64748b;
      font-weight: 600;
    }
    .info-value {
      color: #0f172a;
      font-weight: 700;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 24px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #a91d22 0%, #801217 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 800;
      padding: 14px 32px;
      border-radius: 14px;
      box-shadow: 0 4px 14px 0 rgba(169, 29, 34, 0.35);
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1>CampusDesk</h1>
        <p>Thapar Institute of Engineering & Technology</p>
      </div>
      <div class="body">
        <div class="greeting">Hello, ${name}! 👋</div>
        <div class="text">
          Welcome to <strong>CampusDesk</strong>, the official classroom availability, scheduling, and live notification platform for Thapar Institute of Engineering & Technology. Your institutional account is active and ready to use.
        </div>
        
        <div class="info-box">
          <table width="100%" cellpadding="6" cellspacing="0">
            <tr>
              <td class="info-label" width="40%">Registered Email:</td>
              <td class="info-value" width="60%">${email}</td>
            </tr>
            <tr>
              <td class="info-label">Account Role:</td>
              <td class="info-value">${roleDisplay}</td>
            </tr>
            <tr>
              <td class="info-label">Assigned Batch:</td>
              <td class="info-value">${batchDisplay}</td>
            </tr>
            <tr>
              <td class="info-label">Campus System:</td>
              <td class="info-value">Thapar Classrooms 2026</td>
            </tr>
          </table>
        </div>

        <div class="text">
          ${role === 'STUDENT' 
            ? 'You can now explore live daywise & timewise classroom timetables, receive teacher broadcast notices for class cancellations, and quickly locate vacant lecture spaces across campus.' 
            : 'You can now request empty classroom bookings, broadcast announcements to your student batches, and instantly un-occupy classrooms for cancelled or rescheduled lectures.'}
        </div>

        <div class="btn-container">
          <a href="${portalUrl}" class="btn" target="_blank">Access CampusDesk Dashboard →</a>
        </div>
      </div>
      <div class="footer">
        Thapar Institute of Engineering & Technology, Bhadson Road, Patiala, Punjab 147004.<br>
        This is an automated system notification. If you did not register for this account, please contact Academic Administration.
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send an email using Resend HTTP API
 */
async function sendViaResend({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'CampusDesk <onboarding@resend.dev>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject,
      html
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Resend API failed');
  }
  return { provider: 'Resend', id: data.id };
}

/**
 * Send an email using Brevo (Sendinblue) HTTP API
 */
async function sendViaBrevo({ to, name, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'admin@thapar.edu';

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'CampusDesk TIET', email: fromEmail },
      to: [{ email: to, name: name || to }],
      subject,
      htmlContent: html
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Brevo API failed');
  }
  return { provider: 'Brevo', id: data.messageId };
}

/**
 * Send an email using SendGrid HTTP API
 */
async function sendViaSendGrid({ to, subject, html }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'campusdesk@thapar.edu';

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: fromEmail, name: 'CampusDesk TIET' },
      subject,
      content: [{ type: 'text/html', value: html }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`SendGrid API error: ${errText}`);
  }
  return { provider: 'SendGrid' };
}

/**
 * Send an email using Nodemailer (SMTP / Gmail / Custom Mailer)
 */
async function sendViaNodemailer({ to, subject, html }) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || `"CampusDesk TIET" <${user}>`;

  if (!user || !pass) {
    throw new Error('SMTP user or password not configured');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html
  });

  return { provider: 'Nodemailer/SMTP', id: info.messageId };
}

/**
 * Main function: Send Welcome Email to a newly registered user
 * Automatically selects provider from environment variables:
 * - RESEND_API_KEY
 * - BREVO_API_KEY
 * - SENDGRID_API_KEY
 * - SMTP_USER + SMTP_PASS
 * Falls back to clean simulation logging if no credentials set yet.
 */
exports.sendWelcomeEmail = async ({ to, name, role, batch }) => {
  const subject = `Welcome to CampusDesk, ${name}! | Thapar Institute of Engineering & Technology`;
  const html = getWelcomeEmailHtml({ name, email: to, role, batch });

  try {
    // 1. Try Resend if configured
    if (process.env.RESEND_API_KEY) {
      const res = await sendViaResend({ to, subject, html });
      console.log(`✉️ [Email Service] Welcome email sent to ${to} via Resend (${res.id})`);
      return { success: true, ...res };
    }

    // 2. Try Brevo if configured
    if (process.env.BREVO_API_KEY) {
      const res = await sendViaBrevo({ to, name, subject, html });
      console.log(`✉️ [Email Service] Welcome email sent to ${to} via Brevo (${res.id})`);
      return { success: true, ...res };
    }

    // 3. Try SendGrid if configured
    if (process.env.SENDGRID_API_KEY) {
      const res = await sendViaSendGrid({ to, subject, html });
      console.log(`✉️ [Email Service] Welcome email sent to ${to} via SendGrid`);
      return { success: true, ...res };
    }

    // 4. Try SMTP / Nodemailer if configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const res = await sendViaNodemailer({ to, subject, html });
      console.log(`✉️ [Email Service] Welcome email sent to ${to} via SMTP (${res.id})`);
      return { success: true, ...res };
    }

    // 5. Fallback: Simulation log in development mode
    console.log(`📬 [Email Service - Ready for API Key] Welcome email generated for: ${to}`);
    console.log(`   Recipient: ${name} (${role}, ${batch || 'No Batch'})`);
    console.log(`   Subject: ${subject}`);
    console.log(`   ℹ️ To deliver real emails, add RESEND_API_KEY, BREVO_API_KEY, SENDGRID_API_KEY, or SMTP_USER/SMTP_PASS in server .env`);

    return { 
      success: true, 
      simulated: true, 
      message: 'Email service ready. Set email API key in .env for live inbox delivery.' 
    };
  } catch (error) {
    console.warn(`⚠️ [Email Service] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};
