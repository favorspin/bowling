var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser');

module.exports = function() {
    var app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    //require all routes
    app.use('/api', require('../app/routes/index.server.routes.js'));
    app.use('/api', require('../app/routes/game.server.routes.js'));

    return app;
}
