var intervalModule = require('../../models/interval');
var Interval = intervalModule.Interval;
var should = require('chai').should();

describe('Interval', function () {
    it('should save an instance', function (done) {
        var userId = intervalModule.Types.ObjectId();
        var interval = new Interval({userId: userId});
        interval.save(function (saveError, doc) {
            Interval.findById(interval.id, function (findError, result) {
                should.not.exist(findError);
                should.exist(result);
                result.userId.toString().should.equal(userId.toString());
                result.id.should.equal(interval.id);
                done();
            });
        });
    });
    it('should save an instance with a promise', function (done) {
        var userId = intervalModule.Types.ObjectId();
        var interval = new Interval({userId: userId});
        interval.save();
        Interval.findById(interval.id).exec().then(
            function (result) {
                should.exist(result);
                result.userId.toString().should.equal(userId.toString());
                result.id.should.equal(interval.id);
                done();
            },
            function (err) {
                done(err);
            }
        );
    });
});
