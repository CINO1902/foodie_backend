const mongoose = require('mongoose');

const notification = new mongoose.Schema({
	id:{
		type: String
	},
	notification_type: {
		type: Number
		//1:money, 2, discount
	},
	discount: {
		type: String
	},
	ordernum:{
		type:String
	},
	amount_daily:{
		type:String
	},
	amount_weekly:{
		type:String
	},
	payment_amount:{
		type:String
	},
	coupon:{
		type:String
	},
	date:{
		type:Date
	}
});

module.exports = mongoose.model('notification', notification)