require('dotenv').config()
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = async (content, template, Subject) => {
    console.log('Username =>', process.env.MAIL)
    console.log('Password =>', process.env.MAIL_PASS)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    });

    const html = await template(content)
    let mailOptions = {
        from: "emailtesteric10@gmail.com",
        to: content.to,
        subject: Subject,
        html: html,
    };

    
    transporter.sendMail(mailOptions, (error, success) => {
        if (error) {
            _message = 'Error sending message'
            console.log('error', error, _message)

            return false
        } else {

            _message = 'Message recieved and will get in touch soon'
            console.log('success', success, _message)
            return true
        }
    });
    transporter.close();

}