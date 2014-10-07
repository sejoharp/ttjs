var mongoose = require('mongoose');  
var Config = require('../config');

//load database
// Mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://' + Config.mongo.url + '/' + Config.mongo.database);  
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));  
db.once('open', function callback() {  
    console.log("Connection with database succeeded.");
});

exports.mongoose = mongoose;
exports.db = db;
