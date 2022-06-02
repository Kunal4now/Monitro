const mailgun = require("mailgun-js");

const mg = mailgun({process.env.MAILGUN_API_KEY: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_process.env.MAILGUN_DOMAIN});

const data = {
	from: process.env.MAILGUN_SENDER,
	to: process.env.MAILGUN_RECIEVER,
	subject: 'Your Website Just went down',
	text: 'Testing some Mailgun awesomness!'
};

let mailWrapper = {
    data: data,
    mg: mg
}

module.exports = mailWrapper