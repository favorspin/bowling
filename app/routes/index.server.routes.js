var express = require('express');
var router = express.Router();


// index test route
router.route('/')
    .get(function(req, res) {
    res.json({ message: 'Welcome to the API!' });
});

module.exports = router;