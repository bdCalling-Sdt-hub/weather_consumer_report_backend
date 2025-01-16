import { nodemailerTransporter } from '../config/nodemailer/nodemailer.config';

export const sendResetPasswordLinkToEmail = (
  emailOfUser: string,
  resetLink: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const myEmail = {
        to: emailOfUser,
        from: 'apurboroy7077@gmail.com', // Replace with your email address
        subject: `Reset Your Password`,
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
            .link {
              display: block;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              color: #2b6cb0;
              text-decoration: none;
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
            <h1>Reset Your Password</h1>
            <p>Hi,</p>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <a href="${resetLink}" class="link">Reset Password</a>
            <p>If you did not request this, please ignore this email or contact support if you have questions.</p>
            <div class="footer">
              <p>Best Regards, <br> Your Team</p>
            </div>
          </div>
        </body>
      </html>
        `,
      };

      nodemailerTransporter.sendMail(myEmail, (error, info) => {
        if (error) {
          console.log('Error:', error);
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve('Email Sent');
        }
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
