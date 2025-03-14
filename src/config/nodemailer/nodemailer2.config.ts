import nodemailer, { Transporter } from 'nodemailer';

// Define types for the options object
interface EmailOptions {
  email: string;
  subject: string;
  html: string;
}

// Get the current date formatted as a string
const currentDate: Date = new Date();

const formattedDate: string = currentDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// Create the function to send emails
const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Create a transporter object using SMTP configuration
  const transporter: Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: 'sh543132@gmail.com',
      pass: 'eqbf gbbl cgmk xwsw',
    },
  });

  const { email, subject, html } = options;

  // Mail options setup
  const mailOptions = {
    from: `${'sh543132@gmail.com'} <${'sh543132@gmail.com'}>`,
    to: email,
    date: formattedDate,
    signed_by: 'bdCalling.com',
    subject,
    html,
  };

  // Send the email using the transporter
  await transporter.sendMail(mailOptions);
};

export { sendEmail };
