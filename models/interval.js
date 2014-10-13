var db = require('./database').db;

var collection = db.collection('intervals');

exports.collection = collection;
exports.ObjectId = db.ObjectId;
exports.findById = function (id) {
    return collection.findOne({_id: id});
};
exports.insert = function (interval) {
    if (!interval.start) {
        interval.start = new Date();
    }
    return collection.insert(interval);
};
exports.findByUserId = function(userId){
  return collection.find({userId: userId}).toArray();
};
