"use strict";

var Interval = require('../../models/interval');
var chai = require('chai');
chai.use(require('chai-datetime'));
var should = chai.should();
var expect = chai.expect;
var IntervalTestData = require('./intervalTestData');
var UserTestData = require('./userTestData');

describe('Interval', function () {
    beforeEach(function () {
        Interval.collection.drop();
    });

    it('should save an instance', function () {
        return Interval.collection.insert(IntervalTestData.interval1User1Closed).then(function (doc) {
            return Interval.collection.findOne({_id: doc._id});
        }).then(function (doc) {
            should.exist(doc);
            doc.userId.toString().should.equal(IntervalTestData.interval1User1Closed.userId.toString());
        });
    });
    it('should find an instance by id', function () {
        return Interval.collection.insert(IntervalTestData.interval1User1Closed).then(function (doc) {
            return Interval.findById(doc._id);
        }).then(function (doc) {
            should.exist(doc);
            doc.userId.toString().should.equal(IntervalTestData.interval1User1Closed.userId.toString());
        });
    });
    it('should insert an instance with new date as default, if not given', function () {
        var userId = Interval.ObjectId();
        return Interval.insert({userId: userId}).then(function (doc) {
            return Interval.findById(doc._id);
        }).then(function (doc) {
            expect(doc.start).to.be.a('Date');
            expect(doc.start).to.equalDate(new Date());
            expect(doc.start).to.beforeTime(new Date());
            expect(doc.userId.toString()).to.be.equal(userId.toString());
        });
    });
    it('should insert an instance with a given date', function () {
        return Interval.insert(IntervalTestData.interval5User1Open).then(function (doc) {
            return Interval.findById(doc._id);
        }).then(function (doc) {
            expect(doc.start.getTime()).to.equal(IntervalTestData.interval5User1Open.start.getTime());
            doc.userId.toString().should.equal(IntervalTestData.interval5User1Open.userId.toString());
        });
    });
    it('should find all instances by userId', function () {
        return Interval.insert(IntervalTestData.interval5User1Open).then(function () {
            return Interval.findByUserId(IntervalTestData.interval5User1Open.userId);
        }).then(function (docs) {
            expect(docs).to.have.length(1);
            expect(docs[0].start).to.equalTime(IntervalTestData.interval5User1Open.start);
            docs[0].userId.toString().should.equal(IntervalTestData.interval5User1Open.userId.toString());
        });
    });
    it('should return an empty array, if there is no instance with the userId', function () {
        return Interval.findByUserId(Interval.ObjectId())
            .then(function (docs) {
                expect(docs).to.have.length(0);
            });
    });
    it('should add the property stop', function () {
        var stopDate = new Date();
        return Interval.insert(IntervalTestData.interval5User1Open).then(function () {
            var change = {$set: {stop: stopDate}};
            var filter = {userId: IntervalTestData.interval5User1Open.userId};
            return Interval.collection.update(filter, change);
        }).then(function () {
            return Interval.findByUserId(IntervalTestData.interval5User1Open.userId);
        }).then(function (docs) {
            expect(docs[0].userId.toString()).to.equal(IntervalTestData.interval5User1Open.userId.toString());
            expect(docs[0].start).to.equalTime(IntervalTestData.interval5User1Open.start);
            expect(docs[0].stop).to.equalTime(stopDate);
        });
    });
    it('should save changes to the same interval', function () {
        var stopDate = new Date();
        return Interval.save(IntervalTestData.interval5User1Open).then(function (doc) {
            doc.stop = stopDate;
            return Interval.collection.save(doc);
        }).then(function () {
            return Interval.collection.find().toArray();
        }).then(function (docs) {
            expect(docs[0].userId.toString()).to.equal(IntervalTestData.interval5User1Open.userId.toString());
            expect(docs[0].start).to.equalTime(IntervalTestData.interval5User1Open.start);
            expect(docs[0].stop).to.equalTime(stopDate);
            expect(docs).to.have.length(1);
        });
    });
    it('find a working user', function () {
        var userId = Interval.ObjectId;
        return Interval.isUserWorking(userId);
    });
    it('find a not working user', function () {
        var userId = Interval.ObjectId;
        return Interval.isUserWorking(userId);
    });
    it('finish an interval(adds a stop date)', function () {
        var userId = Interval.ObjectId;
        return Interval.stop(userId);
    });
    it('start an interval', function () {
        var userId = Interval.ObjectId;
        return Interval.start(userId);
    });
    it('should find all intervals in range', function () {
        return Interval.collection.insert(IntervalTestData.all()).then(function () {
            return Interval.findInRange(new Date(2014, 10, 11, 0, 0, 0, 0), new Date(2014, 10, 9, 23, 59, 59, 0), UserTestData.user1._id);
        });
    });

});
