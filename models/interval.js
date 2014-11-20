var db = require('./database').db;

exports.collection = db.collection('intervals');
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
exports.stop = function (userId) {
    return exports.collection.findOne({userId: userId, stop: {$exists: false}})
        .then(function (interval) {
            if (interval.start.getTime() > new Date){
                throw new Error("START_CANNOT_BE_IN_FUTURE");
            }
            interval.stop = new Date();
            return exports.save(interval);
        });
};
exports.findInRange = function (userId, start, end) {
    return exports.collection.find({start: {$gte: start, $lte: end},userId: userId}).toArray();
};