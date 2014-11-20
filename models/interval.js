var db = require('./database').db;

exports.collection = db.collection('intervals');
exports.ObjectId = db.ObjectId;
exports.findById = function (id, callback) {
    exports.collection.findOne({_id: id}, callback);
};
exports.insert = function (interval, callback) {
    if (!interval.start) {
        interval.start = new Date();
    }
    exports.collection.insert(interval, callback);
};
exports.findByUserId = function (userId, callback) {
    exports.collection.find({userId: userId}, callback);
};
exports.save = function (document, callback) {
    if (!document.start) {
        callback(new Error('START_MISSING'));
    } else {
        exports.collection.save(document, callback);
    }
};
exports.isUserWorking = function (userId, callback) {
    exports.collection.count({userId: userId, stop: {$exists: false}}, function (error, amount) {
        callback(error, amount > 0);
    });
};
exports.start = function (userId, callback) {
    exports.collection.insert({userId: userId, start: new Date()}, callback);
};
exports.stop = function (userId, callback) {
    exports.collection.findOne({userId: userId, stop: {$exists: false}}, function (error, doc) {
        if (doc.start.getTime() > new Date().getTime()) {
            callback(new Error("START_CANNOT_BE_IN_FUTURE"));
        } else {
            doc.stop = new Date();
            exports.save(doc, callback);
        }
    });
};
exports.findInRange = function (userId, start, end, callback) {
    exports.collection.find({start: {$gte: start, $lte: end}, userId: userId}, callback);
};
