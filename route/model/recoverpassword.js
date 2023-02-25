const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recoverpassword = Schema({
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

module.exports  = mongoose.model("recoverpassword", recoverpassword);

