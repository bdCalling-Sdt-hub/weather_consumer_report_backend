import colors from 'colors';
import nodemailer from 'nodemailer';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';
import { ISendEmail } from '../types/email';

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: Number(config.email.smtp.port),
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass,
  },
});

// Verify transporter connection
if (config.env !== 'test') {
  transporter
    .verify()
    .then(() => logger.info(colors.cyan('📧  Connected to email server')))
    .catch(err =>
      logger.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
      )
    );
}

// Function to send email
const sendEmail = async (values: ISendEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `"${config.email.from}"`, // sender address
      to: values.to, // list of receivers
      subject: values.subject, // subject line
      html: values.html, // html body
    });
    logger.info('Mail sent successfully', info.accepted);
  } catch (error) {
    errorLogger.error('Email', error);
  }
};

// Generate email body
const generateEmailBody = (otp: string, type: string) => {
  return `
    <body style="background-color: #f3f4f6; font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 0;">
      <div style="width: 100%; padding: 2rem; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); text-align: center;">
          <!-- Logo -->
          <img src="https://i.postimg.cc/9fRd0Qn4/Ellipse-1102.png" alt="Designflow Logo" style="max-width: 90px; margin-bottom: 20px; border-radius: 50%;">

          <!-- Header -->
          <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937; font-family: 'Helvetica Neue', sans-serif;">Welcome to Designflow</h1>

          <!-- Introductory Text -->
          <p style="color: #4b5563; margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.5;">Thank you for joining Designflow! Your account is almost ready. Please use the code below to verify your account.</p>

          <!-- OTP Code Box -->
          <div style="background: linear-gradient(135deg, #1CD64F, #A4E786); color: #ffffff; padding: 1rem; border-radius: 0.5rem; font-size: 2.5rem; font-weight: 800; letter-spacing: 0.1rem; margin-bottom: 1.5rem; text-transform: uppercase;">
            ${otp}
          </div>

          <!-- Verification Instructions -->
          <p style="color: #4b5563; margin-bottom: 1.5rem; font-size: 1rem;">Enter this code to verify your account.</p>

          <!-- Footer Text -->
          <p style="color: #6b7280; font-size: 0.875rem; margin-top: 1.5rem;">If you did not request this verification, please ignore this email.</p>
          <p style="color: #6b7280; font-size: 0.875rem;">Thanks, The Designflow Team</p>

          <!-- Expiry Information -->
          <p style="color: #ff0000; font-size: 0.85rem; margin-top: 1.5rem;">This code expires in <span id="timer">3:00</span> minutes.</p>

          <!-- Additional Footer with Contact Info -->
          <div style="margin-top: 2rem; font-size: 0.875rem; color: #b0b0b0;">
            <p>Designflow, Inc. | 1234 Design Ave, Suite 101 | City, Country</p>
            <p style="margin-top: 0.5rem;">If you are having trouble, contact support at <a href="mailto:support@designflow.com" style="color: #1CD64F; text-decoration: none;">support@designflow.com</a></p>
          </div>
        </div>
      </div>
    </body>
  `;
};

// Function to send email verification
const sendEmailVerification = async (to: string, otp: string) => {
  const subject = 'Designflow - Account Verification Code';
  const html = generateEmailBody(otp, 'Account Verification');
  await sendEmail({ to, subject, html });
};

// Function to send reset password email
const sendResetPasswordEmail = async (to: string, otp: string) => {
  const subject = 'Designflow - Password Reset Code';
  const html = generateEmailBody(otp, 'Password Reset');
  await sendEmail({ to, subject, html });
};

export { sendEmailVerification, sendResetPasswordEmail };
