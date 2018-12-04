var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserItemSchema = new Schema({
    name:{type:String},
    price:{type:Number},
    description:{type:String},
    comment:Array(),
    rating:Array(),

    quantity:Number,
    tax:Number,
    rater:String,

});

module.exports = mongoose.model('UserItem',UserItemSchema);