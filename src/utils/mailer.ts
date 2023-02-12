import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

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
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // const msg = {
  //   to: email,
  //   from: process.env.EMAIL_ADDRESS, // Use the email address or domain you verified above
  //   subject: "Verification Email",
  //   // text: "and easy to do anywhere, even with Node.js",
  //   html: "<strong>Testing</strong>",
  // };
  // //ES6
  // sgMail.send(msg).then(
  //   (res) => {
  //     console.log("success", res);
  //   },
  //   (error) => {
  //     console.error(error);

  //     if (error.response) {
  //       console.error(error.response.body);
  //     }
  //   }
  // );
};
export default Mailer;
