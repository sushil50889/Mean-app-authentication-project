var nodemailer = require('nodemailer');
const config = require("./config");

module.exports = (userName, userEmail, otp) => {
    const output = `
  <p>Hi, ${userName}</p>
  <p>You are receiving this email because, you registered to our website. To continue with the login, Please confirm and verify your email account by the OTP given Below.</p>
  <br>
  <p>Your Verify OTP : ${otp}</p>
  <br>
  <br>
  <p>Thank You.</p>
  `;

  // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.senderMail, // generated ethereal user
            pass: config.senderMailPass  // generated ethereal password
          },
        tls: {
        rejectUnauthorized: false
          }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"Admin" <${config.senderMail}>`, // sender address
        to: userEmail, // list of receivers
        subject: 'Verify Your Email Account', // Subject line
        text: '', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}