const mongoose = require('mongoose');

const cartschema = new mongoose.Schema({
	id: {
		type: String
	},
	packageid:{
		type:String,
	},
	package_group:{
		type:String,
	},
	amount_total:{
		type:String
	},
	
});

module.exports = mongoose.model('cart', cartschema)