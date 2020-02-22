const mailgun = require("mailgun-js");
const domain = 'Acaply.com';
const api_key = process.env.MAILGUN_API_KEY;
const mg = mailgun({apiKey: api_key, domain: domain});

class EmailHelper {
    constructor(receiverEmail, passwordResetLink) {
        this.data = {
            from: 'Excited User <me@samples.mailgun.org>',
            to: 'andrewzhlee@gmail.com',
            subject: 'Mailgun test email (Acaply)',
            text: 'Testing some Mailgun awesomness!'
        };
    }

    // send email with password reset link
    sendEmail() {
        mg.messages().send(data, function (error, body) {
            console.log(body);
        });
    }
}

module.exports = {
    EmailHelper
};