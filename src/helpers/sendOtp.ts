import { nodemailerTransporter } from '../config/nodemailer/nodemailer.config';

export const sendOtpViaEmail = async (
  nameOfUser: string,
  emailOfUser: string,
  otp: string
) => {
  try {
    const myEmail = {
      to: emailOfUser,
      from: 'support@dongaraaccommodation.com.au', // Sender email
      subject: `Your OTP for Verification`,
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f7fc;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #2d3748;
              text-align: center;
              font-size: 24px;
            }
            p {
              line-height: 1.6;
              font-size: 16px;
            }
            .otp {
              font-size: 20px;
              font-weight: bold;
              color: #2b6cb0;
              text-align: center;
              padding: 10px;
              background-color: #f9fafb;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verification OTP</h1>
            <p>Hi ${nameOfUser},</p>
            <p>Thank you for signing up. Please use the OTP below to verify your email address:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
            <div class="footer">
              <p>If you did not request this, please ignore this email.</p>
              <p>Best Regards, <br> Your Team</p>
            </div>
          </div>
        </body>
      </html>
        `,
    };

    // Sending the email
    const info = await nodemailerTransporter.sendMail(myEmail);
    console.log('OTP email sent:', info.response);
    return 'OTP email sent';
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};
