import { nodemailerTransporter } from '../config/nodemailer/nodemailer.config';

export const sendPasswordResetOtpViaEmail = (
  nameOfUser: string,
  emailOfUser: string,
  otp: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const myEmail = {
        to: emailOfUser,
        from: 'your-email@example.com', // Replace with your email address
        subject: `Password Reset OTP`,
        html: `
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f9f9f9;
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
              color: #d9534f;
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
              color: #5cb85c;
              text-align: center;
              padding: 10px;
              background-color: #f0f4f8;
              border: 1px solid #d6e9c6;
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
            <h1>Password Reset OTP</h1>
            <p>Dear ${nameOfUser},</p>
            <p>You requested to reset your password. Please use the OTP below to proceed with the reset process:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please contact our support team immediately.</p>
            <div class="footer">
              <p>If you did not request this, you can safely ignore this email.</p>
              <p>Best Regards, <br> Your Support Team</p>
            </div>
          </div>
        </body>
      </html>
        `,
      };

      // Send the email using the transporter
      nodemailerTransporter.sendMail(myEmail, (error, info) => {
        if (error) {
          console.error('Error:', error);
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve('Email Sent');
        }
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
