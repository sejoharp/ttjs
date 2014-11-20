"use strict";

var Interval = require('../../models/interval');
var chai = require('chai');
chai.use(require('chai-datetime'));
var should = chai.should();
var expect = chai.expect;
var intervalTestData = require('./intervalTestData');
var userTestData = require('./userTestData');

describe('Interval', function () {
    beforeEach(function () {
        Interval.collection.drop();
    });

    it('saves an instance', function (done) {
        Interval.collection.insert(intervalTestData.interval1User1Closed, function (err, docs) {
            Interval.collection.findOne({_id: intervalTestData.interval1User1Closed._id}, function (err, doc) {
                expect(doc.userId.toString()).to.equal(intervalTestData.interval1User1Closed.userId.toString());
                done();
            });
        });
    });
    it('finds an instance by id', function (done) {
        Interval.collection.insert(intervalTestData.interval1User1Closed, function (err, doc) {
            Interval.findById(doc._id, function (error, doc) {
                should.exist(doc);
                expect(error).to.not.exist;
                doc.userId.toString().should.equal(intervalTestData.interval1User1Closed.userId.toString());
                done();
            });
        });
    });
    it('inserts an instance with new date as default, if not given', function (done) {
        var userId = Interval.ObjectId();
        Interval.insert({userId: userId}, function (error, interval) {
            Interval.findById(interval._id, function (error, doc) {
                expect(doc.start).to.be.a('Date');
                expect(doc.start).to.equalDate(new Date());
                expect(doc.start).to.beforeTime(new Date());
                expect(doc.userId.toString()).to.be.equal(userId.toString());
                done();
            });
        });
    });
    it('inserts an instance with a given date', function (done) {
        Interval.insert(intervalTestData.interval5User1Open, function (error, interval) {
            Interval.findById(interval._id, function (error, doc) {
                expect(doc.start.getTime()).to.equal(intervalTestData.interval5User1Open.start.getTime());
                expect(doc.userId.toString()).to.equal(intervalTestData.interval5User1Open.userId.toString());
                done();
            });
        });
    });
    it('finds all instances by userId', function (done) {
        Interval.collection.insert(intervalTestData.all(), function () {
            Interval.findByUserId(intervalTestData.interval4User2Closed.userId, function (error, docs) {
                expect(docs).to.have.length(1);
                expect(docs[0].start).to.equalTime(intervalTestData.interval4User2Closed.start);
                docs[0].userId.toString().should.equal(intervalTestData.interval4User2Closed.userId.toString());
                done();
            });
        });
    });
    it('returns an empty array, if there is no instance with the userId', function (done) {
        Interval.findByUserId(Interval.ObjectId(), function (error, docs) {
            expect(docs).to.have.length(0);
            done();
        })
    });
    it('adds the property stop', function (done) {
        var stopDate = new Date();
        Interval.insert(intervalTestData.interval5User1Open, function () {
            var change = {$set: {stop: stopDate}};
            var filter = {userId: intervalTestData.interval5User1Open.userId};
            Interval.collection.update(filter, change, function () {
                Interval.findByUserId(intervalTestData.interval5User1Open.userId, function (error, docs) {
                    expect(docs[0].userId.toString()).to.equal(intervalTestData.interval5User1Open.userId.toString());
                    expect(docs[0].start).to.equalTime(intervalTestData.interval5User1Open.start);
                    expect(docs[0].stop).to.equalTime(stopDate);
                    done();
                });
            });
        });
    });
    it('saves changes to the same interval', function (done) {
        var stopDate = new Date();
        Interval.save(intervalTestData.interval5User1Open, function (error, doc) {
            doc.stop = stopDate;
            Interval.collection.save(doc, function () {
                Interval.collection.find(function (error, docs) {
                    expect(docs[0].userId.toString()).to.equal(intervalTestData.interval5User1Open.userId.toString());
                    expect(docs[0].start).to.equalTime(intervalTestData.interval5User1Open.start);
                    expect(docs[0].stop).to.equalTime(stopDate);
                    expect(docs).to.have.length(1);
                    done();
                });
            });
        });
    });
    it('finds a not working user', function (done) {
        Interval.save(intervalTestData.interval7User1Closed, function () {
            Interval.isUserWorking(intervalTestData.interval7User1Closed.userId, function (error, isWorking) {
                expect(isWorking).to.be.false;
                done();
            });
        });
    });
    it('finds a working user', function (done) {
        Interval.save(intervalTestData.interval6User1Open, function () {
            Interval.isUserWorking(intervalTestData.interval6User1Open.userId, function (error, isWorking) {
                expect(isWorking).to.be.true;
                done();
            });
        });
    });
    it('finishes an interval(adds a stop date)', function (done) {
        Interval.save(intervalTestData.interval6User1Open, function () {
            Interval.stop(userTestData.user1.id(), function () {
                Interval.findByUserId(userTestData.user1.id(), function (error, intervals) {
                    expect(intervals).to.have.length(1);
                    expect(intervals[0].userId.toString()).to.equal(intervalTestData.interval6User1Open.userId.toString());
                    expect(intervals[0].start).to.equalTime(intervalTestData.interval6User1Open.start);
                    expect(intervals[0].stop).to.afterTime(intervals[0].start);
                    done();
                });
            });
        });
    });
    it('starts an interval', function (done) {
        var userId = Interval.ObjectId();
        Interval.start(userId, function () {
            Interval.findByUserId(userId, function (error, intervals) {
                expect(intervals).to.have.length(1);
                expect(intervals[0].start).to.equalDate(new Date());
                expect(intervals[0].start).to.beforeTime(new Date());
                expect(intervals[0].userId.toString()).to.be.equal(userId.toString());
                done();
            });
        });
    });
    it('returns empty array when a user has no intervals', function (done) {
        var userId = Interval.ObjectId();
        Interval.collection.insert(intervalTestData.all(), function () {
            Interval.findByUserId(userId, function (error, intervals) {
                expect(intervals).to.have.length(0);
                done();
            });
        });
    });
    it('returns all intervals in a given range', function (done) {
        Interval.collection.insert(intervalTestData.all(), function () {
            Interval.findInRange(userTestData.user1._id, new Date(2014, 10, 10, 0, 0, 0, 0), new Date(2014, 10, 11, 23, 59, 59, 0), function (error, intervals) {
                expect(intervals).to.have.length(1);
                expect(intervals[0].start).to.equalTime(intervalTestData.interval3User1Closed.start);
                expect(intervals[0].stop).to.equalTime(intervalTestData.interval3User1Closed.stop);
                expect(intervals[0].userId.toString()).to.equal(intervalTestData.interval3User1Closed.userId.toString());
                done();
            });
        });
    });
    it('calculates the overtime with given time to work per day', function (done) {
        Interval.collection.insert(intervalTestData.all(), function () {
            Interval.computeOvertime(userTestData.user1.id(), userTestData.user1.worktime, function (error, overtime) {
                expect(overtime).is.equal();
                done();
            });
        });
    });
    it('ignores open intervals when calculating overtime');
    it('ensures that stop is later than start');
    it('throws that stop is later than start', function (done) {
        Interval.collection.insert(intervalTestData.interval2User3Open(), function () {
            Interval.stop(userTestData.user3.id(), function (error) {
                expect(error.message).to.equal('START_CANNOT_BE_IN_FUTURE');
                done();
            });
        });
    });
    it('does not save an interval without a start', function (done) {
        return Interval.save(intervalTestData.interval2User3Invalid, function () {
            expect(error.message).to.equal('START_MISSING');
            done();
        });
    });
});
