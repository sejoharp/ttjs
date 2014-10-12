var intervalModule = require('../../models/interval');
var Interval = intervalModule.Interval;
var should = require('chai').should();

describe('Interval', function () {
    it('should save an instance', function () {
        var userId = intervalModule.ObjectId();
        var interval = {userId: userId};
        return Interval.insert(interval)
            .then(function (doc) {
                return Interval.findOne({_id: doc._id});
            })
            .then(function (doc) {
                should.exist(doc);
                doc.userId.toString().should.equal(userId.toString());
            });
    });
    it('should save an instance with a promise');
});
