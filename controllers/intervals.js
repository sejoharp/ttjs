exports.index = {
    handler: function (request, reply) {
        var data =
            '<h1> Hi there! </h1>' +
            '<p> Would you like to <a href="login">login</a> or <a href="register">register</a>? </p>';

        reply(data);
    }
}
