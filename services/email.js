const mailgun = require("mailgun-js");


exports.mailWrapper = (reciever) => {
	const mg = mailgun({process.env.MAILGUN_API_KEY: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_process.env.MAILGUN_DOMAIN});
}
