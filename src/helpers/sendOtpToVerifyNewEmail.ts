import { nodemailerTransporter } from '../config/nodemailer/nodemailer.config';

export const sendContactUsEmail = (
  userName: string,
  userEmail: string,
  message: string,
  ownerEmail: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contactUsEmail = {
        to: ownerEmail, // Owner's email address
        from: userEmail, // Sender's email address (user)
        subject: `New Contact Us Message from ${userName}`,
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
            .message {
              font-size: 16px;
              font-weight: normal;
              color: #2b6cb0;
              background-color: #f9fafb;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              padding: 15px;
              margin-top: 20px;
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
            <h1>New Message from ${userName}</h1>
            <p>Hi Team,</p>
            <p>You have received a new message from the contact form. Here are the details:</p>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <div class="message">
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>Thank you for your attention.</p>
              <p>Best Regards, <br> Your Team</p>
            </div>
          </div>
        </body>
      </html>
        `,
      };

      nodemailerTransporter.sendMail(contactUsEmail, (error, info) => {
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
