const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const unregistered = Schema({
    id:{
        type:String
    },
    address:{
        type: String
    }
})

module.exports = mongoose.model('unregistered', unregistered)