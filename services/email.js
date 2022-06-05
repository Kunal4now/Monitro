const mailgun = require("mailgun-js");


exports.mailWrapper = (reciever) => {
	const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
}
