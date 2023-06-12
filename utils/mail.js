const transporter = require("../config/mailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

module.exports = async (to, subject, content) => {
  const message = {
    from: process.env.MAIL_USERNAME, // Sender address
    to: to, // List of recipients
    subject: subject, // Subject line
    html: content,
  };
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent");
    }
  });
};
