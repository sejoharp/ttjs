var ObjectId = require('mongojs').ObjectId;

module.exports = {
    user1: {
        _id: ObjectId(),
        worktime: 8 * 60 * 60,
        id: function () {
            return this._id;
        }
    },
    user2: {
        _id: ObjectId(),
        id: function () {
            return this._id;
        }
    }, user3: {
        _id: ObjectId(),
        worktime: 8 * 60 * 60,
        id: function () {
            return this._id;
        }
    }

};