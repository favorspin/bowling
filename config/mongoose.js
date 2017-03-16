var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);

    //require all models
    require('../app/models/game.server.model');

    return db;
};