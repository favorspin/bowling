var Game = require('mongoose').model('Game');

exports.getAllGames = function(req, res) {

    Game.find(function(err, games) {
        if (err) {
            res.send(err);
        }
        res.json(games);
    });

};

exports.createGame = function(req, res) {

    var game = new Game();

    game.save(function(err) {
            if (err) {
                res.send(err);
            }
    });

    res.json(game);

};

exports.getGame = function(req, res) {

    Game.findById(req.params.game_id, function(err, game) {
        if (err) {
            res.send(err);
        }
        res.json(game);
    });

};

exports.deleteGame = function(req, res) {

    Game.remove({
        _id: req.params.game_id
    }, function(err, game) {
        if (err) {
            res.send(err);
        }
    res.status(204).end();
    });

};

function calculateScore(game) {

    cumulative = game.score[game.score.length - 1] || 0;

    frame = 0;
    frame_updated = false;

    raw_frames = [];

    // rolls -> base frame scores
    for (i = 0; i < game.rolls.length; i++) {

        if (game.rolls[i][1] > 1) {
            raw_frames[raw_frames.length - 1][0] += game.rolls[i][2];
            raw_frames[raw_frames.length - 1][1] += 1;
        } else {
            raw_frames.push([game.rolls[i][2], 1]);
        }
    }

    // caculate cumulative scores - only check frames that have not been calculated, thus far
    for (i = game.score.length; i < game.display_score.length; i++) {

        // check 10th frame complete
        if (i == 9 && game.current_frame == 0) {
            frame = raw_frames[i][0];
            cumulative += frame;
            game.score.push(cumulative);
            game.total_score = cumulative;
        } else if ((raw_frames[i][0] == 10 || raw_frames[i][1] == 2) && i != 9) { // check other frames complete
            if (raw_frames[i][0] == 10) { //spares or strikes
                if (raw_frames[i][1] == 2 && raw_frames.length == i + 2) { // spare
                    frame = raw_frames[i][0] + raw_frames[i+1][0];
                    frame_updated = true;
                } else if (raw_frames.length == i + 2) { // strike
                    if (raw_frames[i+1][1] == 2) {
                        frame = raw_frames[i][0] + raw_frames[i+1][0];
                        frame_updated = true;
                    }
                } else if (raw_frames.length == i + 3) { // multi-strike
                    frame = raw_frames[i][0] + raw_frames[i+1][0] + raw_frames[i+2][0]
                    frame_updated = true;
                }
            } else {
                frame = raw_frames[i][0];
                frame_updated = true;
            }

            // if we were able to score a frame, push cumulative score and update total score
            if (frame_updated) {
                cumulative += frame;
                game.score.push(cumulative);
                game.total_score = cumulative;
            }
        }

        frame_updated = false;
        frame = 0;

    }

};

exports.updateScore = function(req, res) {

    Game.findById(req.params.game_id, function(err, game) {

        if (err) {
            res.send(err);
        }

        // last_roll = game.rolls[game.rolls.length - 1][2];

        last_roll = game.last_roll;
        pins = req.body.pins;
        position = game.display_score.length - 1;

        // Check for finished game or invalid number of pins
        if (game.current_frame == 0) {
            res.status(400).send({ message: 'Game is already complete. '});
        } else if (pins > 10 || pins < 0 || (game.current_turn == 2 && last_roll + Number(pins) > 10 && last_roll != 10)) {
            res.status(400).send({ message: 'Invalid Number of Pins' });
        } else {

            game.rolls.push([game.current_frame, game.current_turn, Number(pins)]);

            // tenth frame has three turns
            if (game.current_frame == 10) {
                if (game.current_turn == 1) {
                    if (pins == 10) {
                        game.display_score.push('X');
                    } else {
                        game.display_score.push(pins);
                    }
                    game.current_turn++;
                } else if (game.current_turn == 2) {
                    if (pins == 10) {
                        game.display_score[position] += 'X';
                        game.markModified('display_score');
                        game.current_turn++;
                    } else if (last_roll + Number(pins) == 10 && pins != 0) {
                        game.display_score[position] += '/';
                        game.markModified('display_score');
                        game.current_turn++;
                    } else {
                        if(game.display_score[position] == 'X') {
                            game.current_turn++;
                        } else {
                            game.current_frame++;
                        }
                        game.display_score[position] += pins;
                        game.markModified('display_score');
                    }
                } else if (game.current_turn == 3) {
                    if (pins == 10) {
                        game.display_score[position] += 'X';
                        game.markModified('display_score');
                    } else if (last_roll + Number(pins) == 10) {
                        if (game.display_score[position].includes('/') || pins == 0) {
                            game.display_score[position] += pins;
                        } else {
                            game.display_score[position] += '/';
                        }
                        game.markModified('display_score');
                    } else {
                        game.display_score[position] += pins;
                        game.markModified('display_score');
                    }
                    game.current_frame++
                    game.current_turn = 1;
                }

            // all other frames only have 2 turns
            } else if (game.current_turn == 1) {
                if (pins == 10) {
                    game.display_score.push('X');
                    game.current_frame++;
                }
                else {
                    game.display_score.push(pins);
                    game.current_turn++;
                }
            } else if (game.current_turn == 2) {
                if (last_roll + Number(pins) == 10) {
                    game.display_score[position] += '/';
                    game.markModified('display_score');
                } else {
                    game.display_score[position] += pins;
                    game.markModified('display_score');
                }
                game.current_frame++;
                game.current_turn = 1;
            }

            // update last roll to check future spares

            if (game.current_frame == 11) {
                game.current_frame = 0;
            }

            game.last_roll = pins;
            game.roll_count += 1;

            calculateScore(game);

            game.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json(game);
            });

        }



    });


};