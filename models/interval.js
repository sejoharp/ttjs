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
exports.findByUserId = function (userId) {
    return collection.find({userId: userId}).toArray();
};
exports.save = function (document) {
    return collection.save(document);
};
exports.isUserWorking = function (userId) {
    return collection.count({userId: userId, stop: {$exists: false}})
        .then(function (count) {
            return count > 0;
        });
};