
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CollectionSchema = new Schema({
    privacy:Boolean,
    owner:String,
    item:[{type:String}],
    name:String,
    description:String,
    rating:Number
});

module.exports = mongoose.model('Collection',CollectionSchema);