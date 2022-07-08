module.exports = function (subject, email, html, cb) {
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "iemservices2021@gmail.com", // iemservices2021@gmail.com
            pass: "wcqwtijslisubdnn" // iems2021
        },
        tls: {
            rejectUnauthorised: false
        }
    });

    let mailOptions = {
        from: '"YD Monitoring System " <admin@ydmonitoringsystem.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: '', // plain text body
        html: html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, cb);
}