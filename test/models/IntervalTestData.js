var ObjectId = require('promised-mongo').ObjectId;
var UserTestData = require('./userTestData');

module.exports = {
    interval1User1Closed: {
        _id: ObjectId(),
        start: new Date(2014, 10, 23, 10, 0, 0, 0),
        stop: new Date(2014, 10, 23, 18, 0, 0, 0),
        userId: UserTestData.user1._id
    },
    interval2User1Closed: {
        _id: ObjectId(),
        start: new Date(2014, 10, 20, 12, 0, 0, 0),
        stop: new Date(2014, 10, 20, 14, 0, 0, 0),
        userId: UserTestData.user1._id
    },
    interval3User1Closed: {
        _id: ObjectId(),
        start: new Date(2014, 10, 10, 8, 0, 0, 0),
        stop: new Date(2014, 10, 10, 16, 30, 0, 0),
        userId: UserTestData.user1._id
    },
    interval4User2Closed: {
        _id: ObjectId(),
        start: new Date(2014, 10, 10, 8, 0, 0, 0),
        stop: new Date(2014, 10, 10, 16, 30, 0, 0),
        userId: UserTestData.user2._id
    },
    interval5User1Open: {
        _id: ObjectId(),
        start: new Date(2014, 10, 1, 9, 0, 0, 0),
        userId: UserTestData.user1._id
    }
};