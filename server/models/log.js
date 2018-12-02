var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
    type:{type:String,required:true},
    description:{type:String, required:true}
});

module.exports = mongoose.model('Log',LogSchema);