var express = require('express');
var bodyParser = require('body-parser');
var intervals = require('./controllers/intervals');

var app = express();



app.use(bodyParser.json());

app.get('/', intervals.index);

app.listen(3000, function(){
    console.log('server started.');
});