var pmongo = require('promised-mongo');
var Config = require('../config');

var db = pmongo('mongodb://' + Config.mongo.host + '/' + Config.mongo.database);

exports.db = db;
exports.ObjectId = pmongo.ObjectId;
