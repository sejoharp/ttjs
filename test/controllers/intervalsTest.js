"use strict";

var Interval = require('../../models/interval');
var chai = require('chai');
chai.use(require('chai-datetime'));
var should = chai.should();
var expect = chai.expect;
var userTestData = require('../models/userTestData');
var intervalTestData = require('../models/intervalTestData');

describe('IntervalController', function () {
    describe('calculates', function () {
        it('the overtime with given time to work per day', function (done) {
            Interval.collection.insert(intervalTestData.all(), function () {
                Interval.computeOvertime(userTestData.user1.id(), userTestData.user1.worktime, function (error, overtime) {
                    expect(overtime).is.equal();
                    done();
                });
            });
        });
        it('open intervals to the current time');
        it('worked time per day', function (done) {
            Interval.collection.insert(intervalTestData.all(), function () {
                Interval.getWorkedTimePerDay(userTestData.user3.id(), new Date(2014, 10, 1), function (workedTime) {
                    expect(workedTime).to.equal(8 * 60 * 60 * 1000);
                    done();
                });
            });
        });
        it('worked time to 0, when the user did not work on this day', function (done) {
            Interval.collection.insert(intervalTestData.all(), function () {
                Interval.getIntervalsPerDay(userTestData.user3.id(), new Date(2014, 10, 3), function (workedTime) {
                    expect(workedTime).to.equal(0);
                    done();
                });
            });
        });
    });
});
