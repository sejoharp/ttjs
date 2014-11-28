var chai = require('chai');
var hasher = require('../../controllers/hasher');
var userTestData = require('../models/userTestData');
var expect = chai.expect;

describe('Hasher', function () {
    it('encrypts a hash', function () {
        expect(hasher.createHash('user1pw', 'key')).to.equal(userTestData.user1.password);
    });
});
