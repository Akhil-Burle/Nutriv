const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

// new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Nutriv <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "Yandex",
        auth: {
          user: process.env.YANDEX_USERNAME,
          pass: process.env.YANDEX_PASSWORD,
        },
      });

      // return nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: "burleakhil@gmail.com",
      //     pass: "Akhil@2008",
      //   },
      // });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    // Send the actualy email with the subject
    // Render HTML from pug.
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html),
    };

    // create a transport and send the email.
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send(
      "welcome",
      "Welcome to Nutriv, Verify yourself before getting started!"
    );
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Reset Your password | Nutriv");
  }

  async emailVerify() {
    await this.send("verifyEmail", "Verify your email | Nutriv");
  }
  async sendBooking() {
    await this.send("booking", "Order placed successfully | Nutriv");
  }
};

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

 */
