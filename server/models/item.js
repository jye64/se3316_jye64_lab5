var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name:String,
    price:Number,
    quantity:Number,
    rating:Number,
    description:String

});

module.exports = mongoose.model('Item',ItemSchema);