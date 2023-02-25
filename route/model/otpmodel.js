const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otpverificationschema = Schema({
    email:{
        type: String,
    },
    otp:{
       type:String,
    },
    createdAt:{
        type:Date,
    },
    expiresAt:{
        type:Date,
    }
});

module.exports  = mongoose.model("userotpverifications", otpverificationschema);

