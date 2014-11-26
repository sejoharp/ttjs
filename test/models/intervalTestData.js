var userTestData = require('./userTestData');
var Interval = require('../../models/interval').Interval;

function getDateInFuture(milliSeconds) {
    var date = new Date();
    date.setTime(date.getTime() + milliSeconds);
    return date;
}

module.exports = {
    interval1User1Closed: new Interval({
        start: new Date(2014, 10, 23, 10, 0, 0, 0),
        stop: new Date(2014, 10, 23, 18, 0, 0, 0),
        userId: userTestData.user1._id
    }),
    interval2User1Closed: new Interval({
        start: new Date(2014, 10, 20, 12, 0, 0, 0),
        stop: new Date(2014, 10, 20, 14, 0, 0, 0),
        userId: userTestData.user1._id
    }),
    interval3User1Closed: new Interval({
        start: new Date(2014, 10, 10, 8, 0, 0, 0),
        stop: new Date(2014, 10, 10, 16, 30, 0, 0),
        userId: userTestData.user1._id
    }),
    interval8User1Closed: new Interval({
        start: new Date(2014, 10, 12, 0, 0, 0, 0),
        stop: new Date(2014, 10, 12, 8, 30, 0, 0),
        userId: userTestData.user1._id
    }),
    interval4User2Closed: new Interval({
        start: new Date(2014, 10, 10, 8, 0, 0, 0),
        stop: new Date(2014, 10, 10, 16, 30, 0, 0),
        userId: userTestData.user2._id
    }),
    interval5User1Open: new Interval({
        start: new Date(2014, 10, 1, 9, 0, 0, 0),
        userId: userTestData.user1._id
    }),
    interval6User1Open: new Interval({
        start: new Date(2014, 10, 1, 9, 0, 0, 0),
        userId: userTestData.user1._id
    }),
    interval7User1Closed: new Interval({
        start: new Date(2014, 10, 1, 9, 0, 0, 0),
        stop: new Date(2014, 10, 1, 16, 30, 0, 0),
        userId: userTestData.user1._id
    }),
    interval1User3Closed: new Interval({
        start: new Date(2014, 10, 1, 8, 0, 0, 0),
        stop: new Date(2014, 10, 1, 12, 0, 0, 0),
        userId: userTestData.user3._id
    }),
    interval2User3Closed: new Interval({
        start: new Date(2014, 10, 1, 13, 0, 0, 0),
        stop: new Date(2014, 10, 1, 17, 0, 0, 0),
        userId: userTestData.user3._id
    }),
    interval2User3Invalid: new Interval({
        stop: new Date(2014, 10, 2, 16, 0, 0, 0),
        userId: userTestData.user3._id
    }),
    interval2User3Open: function () {
        return new Interval({
            start: getDateInFuture(2 * 60 * 60 * 1000),
            userId: userTestData.user3._id
        })
    },
    all: function () {
        return [this.interval1User1Closed,
            this.interval2User1Closed,
            this.interval3User1Closed,
            this.interval8User1Closed,
            this.interval4User2Closed,
            this.interval5User1Open,
            this.interval6User1Open,
            this.interval7User1Closed,
            this.interval1User3Closed,
            this.interval2User3Closed];
    }
};