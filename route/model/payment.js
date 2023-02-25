const mongoose = require('mongoose');

const payment = new mongoose.Schema({
	payment_type: {
		type: int
	},
	discount: {
		type: String
	},
	amount_total:{
		type:String
	},
	amount_paid:{
		type:String
	},
	date:{
		type:Date
	}
});

module.exports = mongoose.model('notification', notification)