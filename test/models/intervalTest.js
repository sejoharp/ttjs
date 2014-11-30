"use strict";

var Interval = require('../../models/interval');
var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var userTestData = require('./userTestData');
var intervalTestData = require('./intervalTestData');

describe('Interval', function () {
    beforeEach(function () {
        Interval.collection.drop();
    });
    describe('saves', function () {
        it('an instance', function (done) {
            Interval.collection.insert(intervalTestData.interval1User1Closed, function (err, docs) {
                Interval.collection.findOne({_id: intervalTestData.interval1User1Closed._id}, function (err, doc) {
                    expect(doc.userId.toString()).to.equal(intervalTestData.interval1User1Closed.userId.toString());
                    done();
                });
            });
        });
        it('an instance with the property stop', function (done) {
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
        it('changes to the same interval', function (done) {
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
        it('only instances with a start property', function (done) {
            Interval.save(intervalTestData.interval2User3Invalid, function (error, doc) {
                expect(error.message).to.equal('START_MISSING');
                done();
            });
        });
        it('no instances with start in future', function (done) {
            Interval.save(intervalTestData.interval2User3Open(), function (error) {
                expect(error.message).to.equal('START_CANNOT_BE_IN_FUTURE');
                done();
            });
        });
    });
    describe('finds', function () {
        it('an instance by id', function (done) {
            Interval.collection.insert(intervalTestData.interval1User1Closed, function (err, doc) {
                Interval.findById(doc._id, function (error, doc) {
                    expect(doc).to.exist;
                    expect(error).to.not.exist;
                    doc.userId.toString().should.equal(intervalTestData.interval1User1Closed.userId.toString());
                    done();
                });
            });
        });
        it('all instances by userId', function (done) {
            Interval.collection.insert(intervalTestData.all(), function () {
                Interval.findByUserId(intervalTestData.interval4User2Closed.userId, function (error, docs) {
                    expect(docs).to.have.length(1);
                    expect(docs[0].start).to.equalTime(intervalTestData.interval4User2Closed.start);
                    docs[0].userId.toString().should.equal(intervalTestData.interval4User2Closed.userId.toString());
                    done();
                });
            });
        });
        it('nothing, so it returns an empty array', function (done) {
            Interval.findByUserId(Interval.ObjectId(), function (error, docs) {
                expect(docs).to.have.length(0);
                done();
            })
        });
        it('a not working user', function (done) {
            Interval.save(intervalTestData.interval7User1Closed, function () {
                Interval.isUserWorking(intervalTestData.interval7User1Closed.userId, function (error, isWorking) {
                    expect(isWorking).to.be.false;
                    done();
                });
            });
        });
        it('a working user', function (done) {
            Interval.save(intervalTestData.interval6User1Open, function () {
                Interval.isUserWorking(intervalTestData.interval6User1Open.userId, function (error, isWorking) {
                    expect(isWorking).to.be.true;
                    done();
                });
            });
        });
        it('all instances in a given range', function (done) {
            Interval.collection.insert(intervalTestData.all(), function () {
                Interval.findInRange(userTestData.user1._id, new Date(2014, 10, 10, 0, 0, 0, 0), new Date(2014, 10, 11, 23, 59, 59, 999), function (error, intervals) {
                    expect(intervals).to.have.length(1);
                    expect(intervals[0].start).to.equalTime(intervalTestData.interval3User1Closed.start);
                    expect(intervals[0].stop).to.equalTime(intervalTestData.interval3User1Closed.stop);
                    expect(intervals[0].userId.toString()).to.equal(intervalTestData.interval3User1Closed.userId.toString());
                    done();
                });
            });
        });
        it('all instances from a user on a day', function (done) {
            Interval.collection.insert(intervalTestData.all(), function () {
                Interval.getIntervalsPerDay(userTestData.user3.id(), new Date(2014, 10, 1), function (error, intervals) {
                    expect(intervals).to.have.length(2);
                    expect(Interval.isEqual(intervals[0],intervalTestData.interval1User3Closed)).be.true;
                    expect(Interval.isEqual(intervals[1],intervalTestData.interval2User3Closed)).be.true;
                    done();
                });
            });
        });
    });
    describe('compares', function () {
        it('equality of instances', function () {
            expect(Interval.isEqual(intervalTestData.interval1User1Closed, intervalTestData.interval1User1Closed)).to.be.true;
        });
        it('inequality of instances', function () {
            expect(Interval.isEqual(intervalTestData.interval1User1Closed, intervalTestData.interval1User3Closed)).to.be.false;
        });
    });
    describe('inserts', function () {
        it('an instance with new date as default, if not given', function (done) {
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
        it('an instance with a given date', function (done) {
            Interval.insert(intervalTestData.interval5User1Open, function (error, interval) {
                Interval.findById(interval._id, function (error, doc) {
                    expect(doc.start.getTime()).to.equal(intervalTestData.interval5User1Open.start.getTime());
                    expect(doc.userId.toString()).to.equal(intervalTestData.interval5User1Open.userId.toString());
                    done();
                });
            });
        });
    });
    describe('finshes', function () {
        it('an interval(adds a stop date)', function (done) {
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
    });
    describe('starts', function () {
        it('an interval', function (done) {
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
    });
    describe('calculates', function () {
        it('the first second on a day', function () {
            var firstSecondOfDay = Interval.getFirstSecondOfDay(new Date(2014, 10, 1));
            expect(firstSecondOfDay.getTime()).to.equal(new Date(2014, 10, 1, 0, 0, 0, 0).getTime());
        });
        it('last first second on a day', function () {
            var firstSecondOfDay = Interval.getLastSecondOfDay(new Date(2014, 10, 1));
            expect(firstSecondOfDay.getTime()).to.equal(new Date(2014, 10, 1, 23, 59, 59, 999).getTime());
        });
    });
});
