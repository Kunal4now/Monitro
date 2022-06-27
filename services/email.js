const mailgun = require("mailgun-js");

let mailWrapper = {
	mg: mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN})
}

module.exports = mailWrapper
// exports.mailWrapper = (reciever) => {
// 	const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
// } 
