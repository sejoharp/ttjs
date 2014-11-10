var ObjectId = require('promised-mongo').ObjectId;

module.exports = {
    user1: {
        _id: ObjectId(),
        id: function () {
            return this._id;
        }
    },
    user2: {
        _id: ObjectId(),
        id: function () {
            return this._id;
        }
    }

};