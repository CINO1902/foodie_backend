const mongoose = require('mongoose');

const storecalcuate = new mongoose.Schema({
	email: {
		type: String
	},
   
	totalamount:{
		type:Number
	},
	drinkamount:{
		type:Number
	},
	finalamount:{
		type:Number,
		default: 0,
	},
	discounted:{
		type:Number
	},
   
});

module.exports = mongoose.model('storecalcuate', storecalcuate)