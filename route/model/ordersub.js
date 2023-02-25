const mongoose = require('mongoose');

const ordersub = new mongoose.Schema({
	email: {
		type: String
	},
	id: {
		type: String
	},
    name:{
        type:String
    },
    phone:{
        type: String
    },
    order:{
        type:Boolean
    },
    location:{
        type:String
    },
	address:{
		type:String
	},
	generatedid:{
		type:String
	},
    ordernum:{
        type:String
    },
    category:{
        type:String
    },
    
    packagename:{
        type:String
    },
    status:{
        type:String,
    },
    image:{
        type:String
    },
    day:{
        type:String
    },
    month:{
        type:String
    },
    year:{
        type:String
    },
    date:{
        type:Date
    },
    createdAt:{
        type:Date
    },
    expire:{
        type:Date
    }
});

module.exports = mongoose.model('ordersub', ordersub)