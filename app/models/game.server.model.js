var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    name: String,
    display_score: [],
    score: [],
    rolls: [],
    roll_count: {
        type: Number,
        default: 0
    },
    last_roll: {
        type: Number,
        default: 0
    },
    current_frame: {
        type: Number,
        default: 1
    },
    current_turn: {
        type: Number,
        default: 1
    },
    total_score: {
        type: Number,
        default: null
    },
    created: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Game', gameSchema);