const mongoose = require('mongoose');

const orderschema = new mongoose.Schema({
	id: {
		type: String
	},
	food: {
		type: String
	},
	amount:{
		type:String
	},
	extras: [
		{
			0: String,
			1: String,
			2: String,
			3: String,
			4: Boolean,
			5: String
		}
	],
	order:{
		type: Boolean,
		default: false
	},
	status:{
		type:Number,
		default:0,
	},
	multiple:{
		type:String
	},
	total:{
		type:String
	},
	discounted_amount:{
		type:String
	},
	image:{
		type:String
	},
	ordernum:{
		type:String
	},
	name:{
        type:String
    },
    number:{
        type:String
    },
    address:{
        type:String
    },
    location:{
        type:String
    },
	discounted:{
		type:Boolean
	},
	packageid:{
		type:String,
	},
	package_group:{
		type:String,
	},
	date:{
		type:Date
	}
});

module.exports = mongoose.model('Order', orderschema)