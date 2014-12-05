"use strict";

var interval = require('../../models/interval');
var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var userTestData = require('../models/userTestData');
var intervalTestData = require('../models/intervalTestData');
var server = require('../../server');

describe('IntervalController', function () {
    it('index', function(done){
        var options = {};
        options.method = 'GET';
        options.url = '/';

        server.inject(options, function(response){
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    describe('calculates', function () {
        it('the overtime with given time to work per day', function (done) {
            interval.collection.insert(intervalTestData.all(), function () {
                interval.computeOvertime(userTestData.user1.id(), userTestData.user1.worktime, function (error, overtime) {
                    expect(overtime).is.equal();
                    done();
                });
            });
        });
        it('open intervals to the current time');
        it('worked time per day', function (done) {
            interval.collection.insert(intervalTestData.all(), function () {
                interval.getWorkedTime(userTestData.user3.id(), new Date(2014, 10, 1), function (workedTime) {
                    expect(workedTime).to.equal(8 * 60 * 60 * 1000);
                    done();
                });
            });
        });
        it('worked time to 0, when the user did not work on this day', function (done) {
            interval.collection.insert(intervalTestData.all(), function () {
                interval.getIntervalsPerDay(userTestData.user3.id(), new Date(2014, 10, 3), function (workedTime) {
                    expect(workedTime).to.equal(0);
                    done();
                });
            });
        });
    });
});
