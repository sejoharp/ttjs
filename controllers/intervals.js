var interval = require('../models/interval');

exports.index = function (req, res) {
    var data =
        '<h1> Hi there! </h1>' +
        '<p> Would you like to <a href="login">login</a> or <a href="register">register</a>? </p>';
    res.send(data);
};

function getWorkedTime(userid, date) {

};
