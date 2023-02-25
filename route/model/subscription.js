const mongoose = require('mongoose');

const subscription = new mongoose.Schema({
	email: {
		type: String
	},
    frequency:{
        type:Number
    },
	day1: [
		{
			0: String,
			1: String,
			2: String,
			3: String,
			4: String,
			5: String,
            6: String
			
		}
	],
    day2: [
		{
			0: String,
			1: String,
			2: String,
			3: String,
			4: String,
			5: String,
            6: String
		}
	],
    day3: [
		{
			0: String,
			1: String,
			2: String,
			3: String,
			4: String,
			5: String,
            6: String
		}
	],
	drink1:{
		type: String,
	},
    drink2:{
        type: String,
    },
	drink3:{
		type: String,
	},
	category1:{
		type:String
	},
	category2:{
		type:String
	},
	category3:{
		type:String
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
    subid:{
        type:String
    },
	subcribed:{
		type:Boolean,
		default:false
	},
	newplan:{
		type:Boolean,
		default:false
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
	}
});

module.exports = mongoose.model('subscription', subscription)