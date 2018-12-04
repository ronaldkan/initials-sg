var nodemailer = require('nodemailer');
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');

var email = 'noreply.initials@gmail.com';
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: 'Pass1234!QAZ'
    }
});

module.exports = {
    sendEmail: function (params) {
        var filePath = __dirname + '/mail.ejs';
        var compiled = ejs.compile(fs.readFileSync(filePath, 'utf8'));

        var mailOptions = {
            from: "hello@initial.sg",
            to: params.to,
            subject: params.subject,
            name: params.name,
            message: params.message,
            url: params.url,
            attachments: [
                {   // file on disk as an attachment
                    path: params.qrcode,
                    cid: "myqr"
                }]
            // message: "As part of the event at GovTech Hive, participants are required to sign an Non-Disclosure Agreement prior to attending the event. Thank you and we hope to seek your kind understanding."
        };

        mailOptions.html = compiled(mailOptions)

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },
    sendConfirmation: function (to, filepath) {
        var filePath = __dirname + '/confirmation.ejs';
        var compiled = ejs.compile(fs.readFileSync(filePath, 'utf8'));

        var mailOptions = {
            from: "hello@initial.sg",
            to: to,
            subject: "Completion on Initials",
            attachments: [
                {   // file on disk as an attachment
                    filename: 'completed.pdf',
                    path: filepath
                }]
            // message: "As part of the event at GovTech Hive, participants are required to sign an Non-Disclosure Agreement prior to attending the event. Thank you and we hope to seek your kind understanding."
        };

        mailOptions.html = compiled(mailOptions)

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};