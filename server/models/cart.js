var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
    name:{type:String},
    quantity:{type:Number},
    rm:Boolean

});

module.exports = mongoose.model('Cart',CartSchema);