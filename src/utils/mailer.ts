import nodemailer from "nodemailer";

const Mailer = (email: string, message: string) => {
  const Transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Verification Email",
    html: message,
  };

  Transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
export default Mailer;
