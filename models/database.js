var Mongorito = require('mongorito');
var Config = require('../config');

Mongorito.connect(Config.mongo.host + '/' + Config.mongo.database);

exports.ObjectId = Mongorito.ObjectId;
exports.Model = Mongorito.Model;
exports.Collection = Mongorito.collection;

