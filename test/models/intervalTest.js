"use strict";

var interval = require('../../models/interval');
var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var userTestData = require('./userTestData');
var intervalTestData = require('./intervalTestData');

describe('interval', function () {
    beforeEach(function () {
        interval.collection.drop();
    });
    describe('saves', function () {
        it('an instance', function (done) {
            interval.collection.insert(intervalTestData.interval1User1Closed, function (err, docs) {
                interval.collection.findOne({_id: intervalTestData.interval1User1Closed._id}, function (err, doc) {
                    expect(doc.userId.toString()).to.equal(intervalTestData.interval1User1Closed.userId.toString());
                    done();
                });
            });
        });
        it('an instance with the property stop', function (done) {
            var stopDate = new Date();
            interval.insert(intervalTestData.interval5User1Open, function () {
                var change = {$set: {stop: stopDate}};
                var filter = {userId: intervalTestData.interval5User1Open.userId};
                interval.collection.update(filter, change, function () {
                    interval.findByUserId(intervalTestData.interval5User1Open.userId, function (error, docs) {
                        expect(docs[0].userId.toString()).to.equal(intervalTestData.interval5User1Open.userId.toString());
                        expect(docs[0].start).to.equalTime(intervalTestData.interval5User1Open.start);
                        expect(docs[0].stop).to.equalTime(stopDate);
                        done();
                    });
                });
            });
        });
        it('changes to the same interval', function (done) {
            var stopDate = new Date();
            interval.save(intervalTestData.interval5User1Open, function (error, doc) {
                doc.stop = stopDate;
                interval.collection.save(doc, function () {
                    interval.collection.find(function (error, docs) {
                        expect(docs[0].userId.toString()).to.equal(intervalTestData.interval5User1Open.userId.toString());
                        expect(docs[0].start).to.equalTime(intervalTestData.interval5User1Open.start);
                        expect(docs[0].stop).to.equalTime(stopDate);
                        expect(docs).to.have.length(1);
                        done();
                    });
                });
            });
        });
        it('only instances with a start property', function (done) {
            interval.save(intervalTestData.interval2User3Invalid, function (error, doc) {
                expect(error.message).to.equal('START_MISSING');
                done();
            });
        });
        it('no instances with start in future', function (done) {
            interval.save(intervalTestData.interval2User3Open(), function (error) {
                expect(error.message).to.equal('START_CANNOT_BE_IN_FUTURE');
                done();
            });
        });
    });
    describe('finds', function () {
        it('an instance by id', function (done) {
            interval.collection.insert(intervalTestData.interval1User1Closed, function (err, doc) {
                interval.findById(doc._id, function (error, doc) {
                    expect(doc).to.exist;
                    expect(error).to.not.exist;
                    expect(doc.userId.toString()).to.equal(intervalTestData.interval1User1Closed.userId.toString());
                    done();
                });
            });
        });
        it('all instances by userId', function (done) {
            interval.collection.insert(intervalTestData.all(), function () {
                interval.findByUserId(intervalTestData.interval4User2Closed.userId, function (error, docs) {
                    expect(docs).to.have.length(1);
                    expect(docs[0].start).to.equalTime(intervalTestData.interval4User2Closed.start);
                    expect(docs[0].userId.toString()).to.equal(intervalTestData.interval4User2Closed.userId.toString());
                    done();
                });
            });
        });
        it('nothing, so it returns an empty array', function (done) {
            interval.findByUserId(interval.ObjectId(), function (error, docs) {
                expect(docs).to.have.length(0);
                done();
            })
        });
        it('a not working user', function (done) {
            interval.save(intervalTestData.interval7User1Closed, function () {
                interval.isUserWorking(intervalTestData.interval7User1Closed.userId, function (error, isWorking) {
                    expect(isWorking).to.be.false;
                    done();
                });
            });
        });
        it('a working user', function (done) {
            interval.save(intervalTestData.interval6User1Open, function () {
                interval.isUserWorking(intervalTestData.interval6User1Open.userId, function (error, isWorking) {
                    expect(isWorking).to.be.true;
                    done();
                });
            });
        });
        it('all instances in a given range', function (done) {
            interval.collection.insert(intervalTestData.all(), function () {
                interval.findInRange(userTestData.user1._id, new Date(2014, 10, 10, 0, 0, 0, 0), new Date(2014, 10, 11, 23, 59, 59, 999), function (error, intervals) {
                    expect(intervals).to.have.length(1);
                    expect(intervals[0].start).to.equalTime(intervalTestData.interval3User1Closed.start);
                    expect(intervals[0].stop).to.equalTime(intervalTestData.interval3User1Closed.stop);
                    expect(intervals[0].userId.toString()).to.equal(intervalTestData.interval3User1Closed.userId.toString());
                    done();
                });
            });
        });
        it('all instances from a user on a day', function (done) {
            interval.collection.insert(intervalTestData.all(), function () {
                interval.getIntervalsPerDay(userTestData.user3.id(), new Date(2014, 10, 1), function (error, intervals) {
                    expect(intervals).to.have.length(2);
                    expect(interval.isEqual(intervals[0],intervalTestData.interval1User3Closed)).be.true;
                    expect(interval.isEqual(intervals[1],intervalTestData.interval2User3Closed)).be.true;
                    done();
                });
            });
        });
    });
    describe('compares', function () {
        it('equality of instances', function () {
            expect(interval.isEqual(intervalTestData.interval1User1Closed, intervalTestData.interval1User1Closed)).to.be.true;
        });
        it('inequality of instances', function () {
            expect(interval.isEqual(intervalTestData.interval1User1Closed, intervalTestData.interval1User3Closed)).to.be.false;
        });
    });
    describe('inserts', function () {
        it('an instance with new date as default, if not given', function (done) {
            var userId = interval.ObjectId();
            interval.insert({userId: userId}, function (error, result) {
                interval.findById(result._id, function (error, doc) {
                    expect(doc.start).to.be.a('Date');
                    expect(doc.start).to.equalDate(new Date());
                    expect(doc.start).to.beforeTime(new Date());
                    expect(doc.userId.toString()).to.be.equal(userId.toString());
                    done();
                });
            });
        });
        it('an instance with a given date', function (done) {
            interval.insert(intervalTestData.interval5User1Open, function (error, result) {
                interval.findById(result._id, function (error, doc) {
                    expect(doc.start.getTime()).to.equal(intervalTestData.interval5User1Open.start.getTime());
                    expect(doc.userId.toString()).to.equal(intervalTestData.interval5User1Open.userId.toString());
                    done();
                });
            });
        });
    });
    describe('finshes', function () {
        it('an interval(adds a stop date)', function (done) {
            interval.save(intervalTestData.interval6User1Open, function () {
                interval.stop(userTestData.user1.id(), function () {
                    interval.findByUserId(userTestData.user1.id(), function (error, intervals) {
                        expect(intervals).to.have.length(1);
                        expect(intervals[0].userId.toString()).to.equal(intervalTestData.interval6User1Open.userId.toString());
                        expect(intervals[0].start).to.equalTime(intervalTestData.interval6User1Open.start);
                        expect(intervals[0].stop).to.afterTime(intervals[0].start);
                        done();
                    });
                });
            });
        });
    });
    describe('starts', function () {
        it('an interval', function (done) {
            var userId = interval.ObjectId();
            interval.start(userId, function () {
                interval.findByUserId(userId, function (error, intervals) {
                    expect(intervals).to.have.length(1);
                    expect(intervals[0].start).to.equalDate(new Date());
                    expect(intervals[0].start).to.beforeTime(new Date());
                    expect(intervals[0].userId.toString()).to.be.equal(userId.toString());
                    done();
                });
            });
        });
    });
    describe('calculates', function () {
        it('the first second on a day', function () {
            var firstSecondOfDay = interval.getFirstSecondOfDay(new Date(2014, 10, 1));
            expect(firstSecondOfDay.getTime()).to.equal(new Date(2014, 10, 1, 0, 0, 0, 0).getTime());
        });
        it('last first second on a day', function () {
            var firstSecondOfDay = interval.getLastSecondOfDay(new Date(2014, 10, 1));
            expect(firstSecondOfDay.getTime()).to.equal(new Date(2014, 10, 1, 23, 59, 59, 999).getTime());
        });
    });
});
