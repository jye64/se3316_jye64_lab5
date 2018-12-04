var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name:{type:String, required:true},
    price:{type:Number, required:true},
    description:{type:String, required:true},
    comment:{type:String},
    rating:{type:Number},

    quantity:Number,
    tax:Number,
    rater:String,
    priv:Boolean

});

module.exports = mongoose.model('Item',ItemSchema);