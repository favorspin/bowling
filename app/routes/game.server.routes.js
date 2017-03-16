var express = require('express'),
    bodyParser = require('body-parser');
var router = express.Router();
var game = require('../controllers/game.server.controller');

// game routes
router.route('/game')
    .get(game.getAllGames)
    .post(game.createGame);

router.route('/game/:game_id')
    .get(game.getGame)
    .put(game.updateScore)
    .delete(game.deleteGame);

module.exports = router;