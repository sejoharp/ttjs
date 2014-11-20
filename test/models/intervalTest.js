"use strict";

var Interval = require('../../models/interval');
var chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-as-promised'));
var should = chai.should();
var expect = chai.expect;
var intervalTestData = require('./intervalTestData');
var userTestData = require('./userTestData');

describe('Interval', function () {
    beforeEach(function () {
        Interval.collection.drop();
    });

    it('saves an instance', function () {
        return Interval.collection.insert(intervalTestData.interval1User1Closed)
            .then(function (doc) {
                return Interval.collection.findOne({_id: doc._id});
            }).then(function (doc) {
                should.exist(doc);
                doc.userId.toString().should.equal(intervalTestData.interval1User1Closed.userId.toString());
            });
    });
    it('finds an instance by id', function () {
        return Interval.collection.insert(intervalTestData.interval1User1Closed)
            .then(function (doc) {
                return Interval.findById(doc._id);
            }).then(function (doc) {
                should.exist(doc);
                doc.userId.toString().should.equal(intervalTestData.interval1User1Closed.userId.toString());
            });
    });
    it('inserts an instance with new date as default, if not given', function () {
        var userId = Interval.ObjectId();
        return Interval.insert({userId: userId})
            .then(function (doc) {
                return Interval.findById(doc._id);
            }).then(function (doc) {
                expect(doc.start).to.be.a('Date');
                expect(doc.start).to.equalDate(new Date());
                expect(doc.start).to.beforeTime(new Date());
                expect(doc.userId.toString()).to.be.equal(userId.toString());
            });
    });
    it('inserts an instance with a given date', function () {
        return Interval.insert(intervalTestData.interval5User1Open)
            .then(function (doc) {
                return Interval.findById(doc._id);
            }).then(function (doc) {
                expect(doc.start.getTime()).to.equal(intervalTestData.interval5User1Open.start.getTime());
                doc.userId.toString().should.equal(intervalTestData.interval5User1Open.userId.toString());
            });
    });
    it('finds all instances by userId', function () {
        return Interval.collection.insert(intervalTestData.all())
            .then(function () {
                return Interval.findByUserId(intervalTestData.interval4User2Closed.userId);
            }).then(function (docs) {
                expect(docs).to.have.length(1);
                expect(docs[0].start).to.equalTime(intervalTestData.interval4User2Closed.start);
                docs[0].userId.toString().should.equal(intervalTestData.interval4User2Closed.userId.toString());
            });
    });
    it('returns an empty array, if there is no instance with the userId', function () {
        return Interval.findByUserId(Interval.ObjectId())
            .then(function (docs) {
                expect(docs).to.have.length(0);
            });
    });
    it('adds the property stop', function () {
        var stopDate = new Date();
        return Interval.insert(intervalTestData.interval5User1Open)
            .then(function () {
                var change = {$set: {stop: stopDate}};
                var filter = {userId: intervalTestData.interval5User1Open.userId};
                return Interval.collection.update(filter, change);
            }).then(function () {
                return Interval.findByUserId(intervalTestData.interval5User1Open.userId);
            }).then(function (docs) {
                expect(docs[0].userId.toString()).to.equal(intervalTestData.interval5User1Open.userId.toString());
                expect(docs[0].start).to.equalTime(intervalTestData.interval5User1Open.start);
                expect(docs[0].stop).to.equalTime(stopDate);
            });
    });
    it('saves changes to the same interval', function () {
        var stopDate = new Date();
        return Interval.save(intervalTestData.interval5User1Open)
            .then(function (doc) {
                doc.stop = stopDate;
                return Interval.collection.save(doc);
            }).then(function () {
                return Interval.collection.find().toArray();
            }).then(function (docs) {
                expect(docs[0].userId.toString()).to.equal(intervalTestData.interval5User1Open.userId.toString());
                expect(docs[0].start).to.equalTime(intervalTestData.interval5User1Open.start);
                expect(docs[0].stop).to.equalTime(stopDate);
                expect(docs).to.have.length(1);
            });
    });
    it('finds a not working user', function () {
        return Interval.save(intervalTestData.interval7User1Closed)
            .then(function () {
                return Interval.isUserWorking(intervalTestData.interval7User1Closed.userId);
            }).then(function (isWorking) {
                expect(isWorking).to.be.false;
            });
    });
    it('finds a working user', function () {
        return Interval.save(intervalTestData.interval6User1Open)
            .then(function () {
                return Interval.isUserWorking(intervalTestData.interval7User1Closed.userId);
            }).then(function (isWorking) {
                expect(isWorking).to.be.true;
            });
    });
    it('finishes an interval(adds a stop date)', function () {
        return Interval.save(intervalTestData.interval6User1Open)
            .then(function () {
                return Interval.stop(userTestData.user1.id());
            }).then(function () {
                return Interval.findByUserId(userTestData.user1.id());
            }).then(function (intervals) {
                expect(intervals).to.have.length(1);
                expect(intervals[0].userId.toString()).to.equal(intervalTestData.interval6User1Open.userId.toString());
                expect(intervals[0].start).to.equalTime(intervalTestData.interval6User1Open.start);
                expect(intervals[0].stop).to.afterTime(intervals[0].start);
            });
    });
    it('starts an interval', function () {
        var userId = Interval.ObjectId();
        return Interval.start(userId)
            .then(function () {
                return Interval.findByUserId(userId)
            }).then(function (intervals) {
                expect(intervals).to.have.length(1);
                expect(intervals[0].start).to.equalDate(new Date());
                expect(intervals[0].start).to.beforeTime(new Date());
                expect(intervals[0].userId.toString()).to.be.equal(userId.toString());
            });
    });
    it('returns empty array when a user has no intervals', function () {
        var userId = Interval.ObjectId();
        return Interval.collection.insert(intervalTestData.all())
            .then(function () {
                return Interval.findByUserId(userId);
            }).then(function (intervals) {
                expect(intervals).to.have.length(0);
            })
    });
    it('returns all intervals in a given range', function () {
        return Interval.collection.insert(intervalTestData.all())
            .then(function () {
                return Interval.findInRange(userTestData.user1._id, new Date(2014, 10, 10, 0, 0, 0, 0), new Date(2014, 10, 11, 23, 59, 59, 0));
            }).then(function (intervals) {
                expect(intervals).to.have.length(1);
                expect(intervals[0].start).to.equalTime(intervalTestData.interval3User1Closed.start);
                expect(intervals[0].stop).to.equalTime(intervalTestData.interval3User1Closed.stop);
                expect(intervals[0].userId.toString()).to.equal(intervalTestData.interval3User1Closed.userId.toString());
            });
    });
    it('calculates the overtime with given time to work per day', function () {
        return Interval.collection.insert(intervalTestData.all())
            .then(function () {
                return Interval.computeOvertime(userTestData.user1.id(), userTestData.user1.worktime);
            }).then(function (overtime) {
                expect(overtime).is.equal()
            })
    });
    it('ignores open intervals when calculating overtime');
    it('ensures that stop is later than start');
    it('throws that stop is later than start', function () {
        return Interval.collection.insert(intervalTestData.interval2User3Open())
            .then(function () {
                return Interval.stop(userTestData.user3.id()).should.be.rejectedWith('START_CANNOT_BE_IN_FUTURE');
            });
    });
    it('throws that stop is later than start2', function () {
        return Interval.collection.insert(intervalTestData.interval2User3Open())
            .then(function () {
                return Interval.stop(userTestData.user3.id());
            }).fail(function (error) {
                expect(error.message).to.equal('START_CANNOT_BE_IN_FUTURE');
            });
    });
    it('throws that stop is later than start3', function () {
        return Interval.collection.insert(intervalTestData.interval2User3Open())
            .then(function () {
                return Interval.stop(userTestData.user3.id());
            }).then(function () {
                chai.assert.fail();
            }, function (error) {
                expect(error.message).to.equal('START_CANNOT_BE_IN_FUTURE');
            });
    });
    it('does not save an interval without a start', function () {
        return Interval.save(intervalTestData.interval2User3Invalid)
            .then(function () {
                chai.assert.fail();
            }, function (error) {
                expect(error.message).to.equal('START_MISSING');
            });
    })
});
