var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name:{type:String},
    price:{type:Number},
    description:{type:String},
    comment:{type:String},
    rating:{type:Number},

    quantity:Number,
    tax:Number,
    rater:String,
    priv:Boolean

});

module.exports = mongoose.model('Item',ItemSchema);