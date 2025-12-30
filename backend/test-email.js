const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    console.log('Testing SMTP connection...');
    const info = await transporter.sendMail({
      from: `"SafePass" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'SafePass Email Test',
      html: '<h2>Test Email</h2><p>If you received this, email is working!</p>',
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
  }

  process.exit(0);
};

testEmail();
