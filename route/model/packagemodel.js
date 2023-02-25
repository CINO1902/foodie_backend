const mongoose = require('mongoose');

const package = new mongoose.Schema({
	category: {
		type: String
	},
	package_name: {
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
	image:{
		type:String
	},
	id:{
		type:String
	},
	common:{
		type:Boolean
	}
});

module.exports = mongoose.model('package', package)