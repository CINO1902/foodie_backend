const mongoose = require('mongoose');

const resgisterSchema = new mongoose.Schema({
	firstname: {
		type: String
	},
	lastname: {
		type: String
	},
	email:{
		type:String
	},
	phone:{
		type:String
	},
	password:{
		type: String,
	},
	
    verified:{
        type:Boolean,
        default:false
    },
	referalid:{
		type:String
	},
	loggedstamp:{
		type:String
	},
	location:{
		type:String
	},
	address:{
		type:String
	},
	date:{
		type:Date
	}
});

module.exports = mongoose.model('registerUser', resgisterSchema)