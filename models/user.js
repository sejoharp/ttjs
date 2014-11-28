var db = require('./database').db;

exports.collection = db.collection('users');
exports.ObjectId = db.ObjectId;
exports.findById = function (id, callback) {
    exports.collection.findOne({_id: id}, callback);
};
exports.findByName = function (name, callback) {
    exports.collection.findOne({name: name}, {password: false}, callback);
};