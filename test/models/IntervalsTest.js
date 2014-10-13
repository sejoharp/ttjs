"use strict";

var Interval = require('../../models/interval');
var chai = require('chai');
chai.use(require('chai-datetime'));
var should = chai.should();
var expect = chai.expect;

describe('Interval', function () {
    beforeEach(function () {
        Interval.collection.drop();
    });

    it('should save an instance', function () {
        var userId = Interval.ObjectId();
        var interval = {userId: userId};
        return Interval.collection.insert(interval)
            .then(function (doc) {
                return Interval.collection.findOne({_id: doc._id});
            })
            .then(function (doc) {
                should.exist(doc);
                doc.userId.toString().should.equal(userId.toString());
            });
    });
    it('should find an instance by id', function () {
        var userId = Interval.ObjectId();
        return Interval.collection.insert({userId: userId})
            .then(function (doc) {
                return Interval.findById(doc._id);
            })
            .then(function (doc) {
                should.exist(doc);
                doc.userId.toString().should.equal(userId.toString());
            });
    });
    it('should insert an instance with new date as default, if not given', function () {
        var userId = Interval.ObjectId();
        return Interval.insert({userId: userId})
            .then(function (doc) {
                return Interval.findById(doc._id);
            })
            .then(function (doc) {
                expect(doc.start).to.be.a('Date');
                expect(doc.start).to.equalDate(new Date());
                expect(doc.start).to.beforeTime(new Date());
                expect(doc.userId.toString()).to.be.equal(userId.toString());
            });
    });
    it('should insert an instance with a given date', function () {
        var interval = {userId: Interval.ObjectId(), start: new Date()};
        return Interval.insert(interval)
            .then(function (doc) {
                return Interval.findById(doc._id);
            })
            .then(function (doc) {
                expect(doc.start.getTime()).to.equal(interval.start.getTime());
                doc.userId.toString().should.equal(interval.userId.toString());
            });
    });
    it('should find all instances by userId', function () {
        var interval = {userId: Interval.ObjectId(), start: new Date()};
        return Interval.insert(interval)
            .then(function () {
                return Interval.findByUserId(interval.userId);
            })
            .then(function (docs) {
                expect(docs).to.have.length(1);
                expect(docs[0].start).to.equalDate(interval.start);
                expect(docs[0].start).to.equalTime(interval.start);
                docs[0].userId.toString().should.equal(interval.userId.toString());
            });
    });
    it('should return an empty array, if there is no instance with the userId', function () {
        return Interval.findByUserId(Interval.ObjectId())
            .then(function (docs) {
                expect(docs).to.have.length(0);
            });
    });
    it('should add the property stop');
});
