const {Router} = require('express');
const Reservation = require('../models/Reservation')
const router = Router();
const mailer = require('../nodemailer');

let user = undefined;

router.get('/', async (req, res) => {
	const reservations = await Reservation.find({}).lean();

	res.render('index', {
		reservations
	})
})

router.post('/create', async (req, res) => {
	const reservation = new Reservation({
		time: req.body.time,
		date: req.body.date,
		name: req.body.name,
		email: req.body.email
	})

	await reservation.save()

	const message = {
		to: req.body.email,
		cc: 'info@itspro.by',
		subject: 'Бронь апартаментов в Booking App',
		html: `
		<h2>Поздравляю, Вы успешно забронировали апартаменты в Booking App!</h2>
		
		<i>Данные вашей брони:</i>
		<ul>
			<li>даты: ${req.body.date}</li>
		</ul>
		`
	}

	await mailer(message);

	user = req.body;

	res.redirect('/');
})

router.get("/back", async function (req, res) {
	const reservations = await Reservation.find();

	res.json(reservations)
})

module.exports = router;
