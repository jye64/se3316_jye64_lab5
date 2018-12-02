var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserItemSchema = new Schema({
    name:{type:String, required:true},
    price:{type:Number, required:true},
    description:{type:String, required:true},
    comment:Array(),
    rating:Array(),

    quantity:Number,
    tax:Number,
    rater:String,

});

module.exports = mongoose.model('UserItem',UserItemSchema);