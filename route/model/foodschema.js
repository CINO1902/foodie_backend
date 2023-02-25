const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const food = Schema({
    id:{
        type:String
    },
    item:{
        type: String
    },
    availability:{
        type:Boolean,
        default:false
    },
    remaining:{
        type:Boolean,
        default:false
    },
    remainingINT:{
        type:String,
        default:'0'
    },

    image_url:{
        type:String
    },
    extras:{
        type:Array,  
    },
   mincost:{
    type:String,
    },
    maxspoon:{
        type: Number
    }, 
    extraable:{
        type:Boolean,
    }
});

module.exports = mongoose.model('foods', food)