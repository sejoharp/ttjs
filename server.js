var Hapi = require('hapi');

// Create a server with a host and port
var server = Hapi.createServer(1337);

var Routes = require('./routes');  

// Print some information about the incoming request for debugging purposes
server.ext('onRequest', function (request, next) {  
    console.log(request.path, request.query);
    next();
});

server.route(Routes.endpoints);

// Start the server
//server.start(function() {
//    console.log("The server has started on port: " + server.info.port);
//});
module.exports = server;
