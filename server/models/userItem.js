var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserItemSchema = new Schema({
    name:{type:String, required:true},
    price:{type:Number, required:true},
    description:{type:String, required:true},
    comment:{type:String,required:true},
    rating:{type:Number,required:true},

    quantity:Number,
    tax:Number,
    rater:String,

});

module.exports = mongoose.model('UserItem',UserItemSchema);