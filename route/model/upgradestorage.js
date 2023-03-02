const mongoose = require('mongoose');

const upgradestorage = new mongoose.Schema({
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
    newplan:{
        type:Boolean
    },
    subid:{
        type:String
    },
	rollover:{
		type:Number,
		default:0
	},
	date:{
		type:Date
	},
    expiredate:{
		type:Date
	},
	day:{
		type:Number,
		default:1
	},
	expireday:{
		type:Number,
		default:30
	},
    drinkamountfood:{
        type:Number,
    },
    existingdrink1:{
        type:String
    },
    existingdrink2:{
        type:String
    },
    existingdrink3:{
        type:String
    },
    drinkget:{
        type:Number,
    }
   
});

module.exports = mongoose.model('upgradestorage', upgradestorage)