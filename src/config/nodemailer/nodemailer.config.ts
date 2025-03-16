import nodemailer from 'nodemailer';

// Create a transporter
export const nodemailerTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  service: 'gmail', // false for 587, true for 465
  auth: {
    user: 'sh543132@gmail.com', // Replace with your email
    pass: 'eqbf gbbl cgmk xwsw', // Replace with your password
  },
});

// Verify the connection
nodemailerTransporter
  .verify()
  .then(() => {
    console.log('📧  Connected to email server ar7');
  })
  .catch(error => {
    console.error('Unable to connect to email server ar7:', error);
  });

// Example of sending an email
const sendEmail = async () => {
  const mailOptions = {
    from: 'sh543132@gmail.com', // Replace with your email
    to: 'apurboroy7077@gmail.com', // Recipient email
    subject: 'Test Email',
    text: 'This is a test email sent using Nodemailer!',
  };

  try {
    const info = await nodemailerTransporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Call the send email function
sendEmail();
