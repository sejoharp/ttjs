var ObjectId = require('mongojs').ObjectId;
//key: key
module.exports = {
    user1: {//user1pw
        _id: ObjectId(),
        name: "user1",
        worktime: 8 * 60 * 60,
        password: "0b7fc98fd84ff95726ab94370048380ca9f55caa92bd40c9591ce78d0fbc0136e96adaccf78bf103e6e44e92694d070f33b43824e4d9074cc4d8f37cdb33acc4",
        id: function () {
            return this._id;
        }
    },
    user2: {//user2pw
        _id: ObjectId(),
        name: "user2",
        worktime: 8 * 60 * 60,
        password: "d405f89abe554a70e2d83854855f29788a2c047f835953ca98c5d99a4a8e44d5b486561e10c5dabfa77939d26692a2c7bc5ad81fb3fe82a54b7733e0829026b0",
        id: function () {
            return this._id;
        }
    }, user3: {//user3pw
        _id: ObjectId(),
        name: "user3",
        worktime: 8 * 60 * 60,
        password: "474bb6923549d3a4e578ab566385979a66a40d74a75bc241c7ae263fe69afdb7ee993edaae36761f27a88df8a3f9427d89ef84318222780d1e80f36328cbb877",
        id: function () {
            return this._id;
        }
    },
    all: function () {
        return [this.user1, this.user2, this.user3];
    }

};