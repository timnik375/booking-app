const {Schema, model} = require('mongoose');

const schema = new Schema({
	time: {
		type: String
	},
	date: {
		type: String
	},
	name: {
		type: String
	},
	email: {
		type: String
	},
})

module.exports = model('Reservation', schema);
