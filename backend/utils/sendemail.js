
const dotenv=require('dotenv')
dotenv.config({path:'../backend/config/config.env'}); 
//in nodemailer to send a email we need to make use of three properties
//1.transporter
//Note that in the general syntax we have made use of the google cloud for sending of these messages
// General Syntax:
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       type: 'OAuth2',
//       user: process.env.MAIL_USERNAME,
//       pass: process.env.MAIL_PASSWORD,
//       clientId: process.env.OAUTH_CLIENTID,
//       clientSecret: process.env.OAUTH_CLIENT_SECRET,
//       refreshToken: process.env.OAUTH_REFRESH_TOKEN
//     }
//   });
//2.mailOptions object
//General Syntax:
// let mailOptions = {
//     from: tomerpacific@gmail.com,
//     to: tomerpacific@gmail.com,
//     subject: 'Nodemailer Project',
//     text: 'Hi from your nodemailer project'
//   };
//3.sendMail property:
//General syntax:
// transporter.sendMail(mailOptions, function(err, data) {
//     if (err) {
//       console.log("Error " + err);
//     } else {
//       console.log("Email sent successfully");
//     }
//   });


const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter =await nodeMailer.createTransport({
    host: "smpt.gmail.com",
    port: 465,
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;