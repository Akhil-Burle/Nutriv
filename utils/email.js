const nodemailer = require("nodemailer");

/* const sendEmail = (options) => {
  // 1: Create a transporter:
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Need to active less secure app option.. before using
  });
  // 2: We need to define the email options:

  // 3: Send the email:
};
 */

const sendEmail = async (options) => {
  // 1: Create a transporter:
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2: We need to define the email options:
  const mailOptions = {
    from: "Akhil Burle <burleakhil@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3: Send the email:
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
