const mongoose = require('mongoose');


const updatepayment = new mongoose.Schema({
    id:{
        type:String
    },
    payment_ref:{
        type:String
    },
    done:{
        type:String,
        default:"unknown"
    }
})

module.exports = mongoose.model('updatepayment', updatepayment)