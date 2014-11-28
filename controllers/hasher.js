var crypto = require('crypto');

exports.createHash = function (password, key) {
    var hash = crypto.createHmac('sha512', key);
    hash.update(password);
    return hash.digest('hex');
};