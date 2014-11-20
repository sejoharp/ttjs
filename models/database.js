var mongojs = require('mongojs');
var Config = require('../config');

var db = mongojs('mongodb://' + Config.mongo.host + '/' + Config.mongo.database);

exports.db = db;
exports.ObjectId = mongojs.ObjectId;
