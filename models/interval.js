var mongoose = require('./database').mongoose;
//var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/test');
//create the schema
var intervalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    start: { type: Date, required: true, default: Date.now },
    stop: { type: Date, required: false }
});

//create the model
var Interval = mongoose.model('Interval', intervalSchema, 'intervals');

exports.Interval = Interval;  
exports.Types =  mongoose.Types;
