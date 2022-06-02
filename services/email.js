const mailgun = require("mailgun-js");

const process.env.MAILGUN_DOMAIN = 'sandbox16cc6fe5b24842c1b7ff1dc25782a2b4.mailgun.org';

const mg = mailgun({process.env.MAILGUN_API_KEY: "2f3b5516c515861116a9c5d794565cf1-27a562f9-5f08d709", domain: process.env.MAILGUN_DOMAIN});

const data = {
	from: 'kunal.rohitas29@gmail.com',
	to: 'kunal.rohitas29@gmail.com',
	subject: 'Your Website Just went down',
	text: 'Testing some Mailgun awesomness!'
};

let mailWrapper = {
    data: data,
    mg: mg
}

module.exports = mailWrapper