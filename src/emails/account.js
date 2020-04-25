const sgMail =require('@sendgrid/mail')

sgMail.setApiKey('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')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/*sgMail.send({
		to: 'zanzanepriyanka.trimax@gmail.com',
		from: 'zanzanepriyanka.trimax@gmail.com',
		subject: 'Welcome to the task manager',
		text: `Welcome to the app. Let me know how you get along with the app.`
	})
*/
const sendWelcomeEmail = (email,name) => {
	sgMail.send({
		to: email,
		from: 'zanzanepriyanka.trimax@gmail.com',
		subject: 'Welcome to the task manager',
		text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
	})
}

module.exports = {
	sendWelcomeEmail
}