"use strict";

var User = require('../../models/user');
var chai = require('chai');
chai.use(require('chai-datetime'));
var should = chai.should();
var expect = chai.expect;
var userTestData = require('./userTestData');
var intervalTestData = require('./intervalTestData');

describe('User', function () {
    beforeEach(function () {
        User.collection.drop();
    });
    describe('finds', function () {
        it('an instance by id', function (done) {
            User.collection.insert(userTestData.all(), function () {
                User.findById(userTestData.user1.id(), function (err, user) {
                    expect(user._id.toString()).to.equal(userTestData.user1.id().toString());
                    done();
                });
            });
        });
        it('an instance by name', function (done) {
            User.collection.insert(userTestData.all(), function () {
                User.findByName(userTestData.user1.name, function (err, user) {
                    expect(user._id.toString()).to.equal(userTestData.user1.id().toString());
                    expect(user.name).to.equal(userTestData.user1.name);
                    expect(user.worktime).to.equal(userTestData.user1.worktime);
                    done();
                });
            });
        });
    });
});
