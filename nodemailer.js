const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: 'smtp.mail.ru',
	port: 465,
	secure: true,
	auth: {
		user: 'booking.app@bk.ru',
		pass: 'jinWyc-wunrav-kaksi0'
	}
}, {
	from: 'Booking app <booking.app@bk.ru>'
})

const mailer = message => {
	transporter.sendMail(message, (err, info) => {
		if (err) return console.log(err)
		console.log('Email sent: ', info)
	})
}

module.exports = mailer;
