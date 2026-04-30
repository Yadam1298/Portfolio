// lib/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmailNotification({
  name,
  email,
  phone,
  message,
  location,
  createdAt,
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  const locationHtml =
    location?.lat && location?.lng
      ? `
      <div style="margin: 20px 0; padding: 15px; background: #f0f0f0; border-radius: 8px;">
        <h3 style="margin: 0 0 10px 0;">📍 Location Information:</h3>
        <p><strong>Latitude:</strong> ${location.lat}</p>
        <p><strong>Longitude:</strong> ${location.lng}</p>
        ${location.address ? `<p><strong>Address:</strong> ${location.address}</p>` : ''}
        <p><a href="https://www.google.com/maps?q=${location.lat},${location.lng}" target="_blank" style="color: #0066cc;">View on Map →</a></p>
      </div>
    `
      : '';

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `📬 New Message from ${name} - Portfolio Contact Form`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <div style="margin-bottom: 25px;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Sender Details</h2>
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>📞 Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
            <p><strong>📅 Date:</strong> ${new Date(createdAt).toLocaleString()}</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">💬 Message</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="margin: 0; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          
          ${locationHtml}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
            <p style="font-size: 12px;">This message was sent from your portfolio contact form.</p>
            <p style="font-size: 12px;">Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      </div>
    `,
  };

  // Also send auto-reply to the user
  const autoReplyOptions = {
    from: `"${process.env.PORTFOLIO_NAME || 'Portfolio Owner'}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thank you for contacting me!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #667eea;">Thank you for reaching out! 🙏</h2>
        <p>Dear ${name},</p>
        <p>I've received your message and will get back to you as soon as possible (usually within 24-48 hours).</p>
        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Your message:</strong></p>
          <p style="font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</p>
        </div>
        <p>Best regards,<br>${process.env.PORTFOLIO_NAME || 'Portfolio Owner'}</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">This is an automated response. Please do not reply to this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}
