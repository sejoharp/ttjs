var db = require('./database').db;

exports.collection = db.collection('intervals');;
exports.ObjectId = db.ObjectId;
exports.findById = function (id) {
    return exports.collection.findOne({_id: id});
};
exports.insert = function (interval) {
    if (!interval.start) {
        interval.start = new Date();
    }
    return exports.collection.insert(interval);
};
exports.findByUserId = function (userId) {
    return exports.collection.find({userId: userId}).toArray();
};
exports.save = function (document) {
    return exports.collection.save(document);
};
exports.isUserWorking = function (userId) {
    return exports.collection.count({userId: userId, stop: {$exists: false}})
        .then(function (count) {
            return count > 0;
        });
};
exports.start = function (userId) {
    return exports.collection.insert({userId: userId, start: new Date()});
};
