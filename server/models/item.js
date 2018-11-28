var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name:String,
    price:Number,
    quantity:Number,
    tax:Number,
    rating:Number,
    description:String,
    rater:[String],
    ratings:[Number],
    comments:[String]

});

module.exports = mongoose.model('Item',ItemSchema);