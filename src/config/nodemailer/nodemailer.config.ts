import nodemailer from 'nodemailer';

// Create a transporter
export const nodemailerTransporter = nodemailer.createTransport({
  host: 'mail.dongaraaccommodation.com.au', // SMTP server
  port: 465, // Use the same port as the PHP script (465 for implicit TLS)
  secure: true, // Use TLS encryption (this matches with SMTPS in PHP)
  auth: {
    user: 'support@dongaraaccommodation.com.au', // SMTP username
    pass: 'chicken-biriyani-120-tk-$', // SMTP password
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
    from: 'support@dongaraaccommodation.com.au', // Sender email
    to: 'apurbooffice707@gmail.com', // Recipient email
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
