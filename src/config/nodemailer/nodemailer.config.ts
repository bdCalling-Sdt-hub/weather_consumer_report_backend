import nodemailer from 'nodemailer';

// Create a transporter
// export const nodemailerTransporter = nodemailer.createTransport({
//   service: 'gmail', // or any other service
//   auth: {
//     user: 'apurboroy7077@gmail.com',
//     pass: 'zijolyhlxxjydndu',
//   },
// });
export const nodemailerTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false for 587, true for 465
  auth: {
    user: 'sh543132@gmail.com', // Replace with your email
    pass: 'eqbf gbbl cgmk xwsw', // Replace with your password
  },
});

// Sending an email
// const mailOptions = {
//   from: "port.denison.customer.care@gmail.com",
//   to: "apurboroy7077@gmail.com",
//   subject: "Test Email",
//   text: "This is a test email sent using nodemailer!",
// };

// nodemailerTransporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error("Error:", error);
//   } else {
//     console.log("Email sent:", info.response);
//   }
// });
