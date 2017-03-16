process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
    express = require('./config/express');

var db = mongoose();
var app = express();

var port = process.env.PORT || 8080;

app.listen(port);

console.log('Making it happen on port ' + port);
