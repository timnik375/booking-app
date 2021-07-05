const express = require('express');
const mongoose = require('mongoose');
const path	= require('path');
const exphbs = require('express-handlebars');
const bookingRoutes = require('./routes/booking');

const PORT = process.env.PORT || 3000;

const app = express();
const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))

app.use(bookingRoutes);

async function start() {
	try {
		await mongoose.connect('mongodb+srv://timnik:1q2w3e4r@cluster0.k1tuf.mongodb.net/reservation ', {
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		})

		app.listen(PORT, () => {
			console.log('Server has been started...')
		})

	} catch (e) {
		console.log(e)
	}
}

start();
