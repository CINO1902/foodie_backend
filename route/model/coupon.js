const mongoose = require('mongoose');

const coupon = new mongoose.Schema({
	code: {
		type: String
        
	},
	amount: {
		type: Number,
        default:0
	},
    discount:{
        type:Number,
        default:0
    },
    type:{
        type:String
    },
    created:{
        type:Date
    },
    expire:{
        type:Date
    }
});

module.exports = mongoose.model('coupon', coupon)