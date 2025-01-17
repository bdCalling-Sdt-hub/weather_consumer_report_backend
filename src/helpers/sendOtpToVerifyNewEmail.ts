import { nodemailerTransporter } from '../config/nodemailer/nodemailer.config';

export const sendOtpToVerifyNewEmail = (
  nameOfUser: string,
  newEmail: string,
  otp: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const verificationEmail = {
        to: newEmail,
        from: 'apurboroy7077@gmail.com', // Replace with your email address
        subject: `Verify Your New Email Address`,
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
            <h1>Email Address Verification</h1>
            <p>Hi ${nameOfUser},</p>
            <p>We received a request to verify this email address for your account. Please use the OTP below to confirm that this is your valid email address:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email or contact support immediately.</p>
            <div class="footer">
              <p>Thank you for your cooperation.</p>
              <p>Best Regards, <br> Your Team</p>
            </div>
          </div>
        </body>
      </html>
        `,
      };

      nodemailerTransporter.sendMail(verificationEmail, (error, info) => {
        if (error) {
          console.error('Error:', error);
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve('Email Sent');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      reject(error);
    }
  });
};
