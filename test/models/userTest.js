"use strict";

var user = require('../../models/user');
var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var userTestData = require('./userTestData');

describe('user', function () {
    beforeEach(function () {
        user.collection.drop();
    });
    describe('finds', function () {
        it('an instance by id', function (done) {
            user.collection.insert(userTestData.all(), function () {
                user.findById(userTestData.user1.id(), function (err, user) {
                    expect(user._id.toString()).to.equal(userTestData.user1.id().toString());
                    done();
                });
            });
        });
        it('an instance by name', function (done) {
            user.collection.insert(userTestData.all(), function () {
                user.findByName(userTestData.user1.name, function (err, user) {
                    expect(user._id.toString()).to.equal(userTestData.user1.id().toString());
                    expect(user.name).to.equal(userTestData.user1.name);
                    expect(user.worktime).to.equal(userTestData.user1.worktime);
                    expect(user.password).to.not.exist;
                    done();
                });
            });
        });
    });
});
