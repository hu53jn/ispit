var express = require('express');
var router = express.Router();

const db = require('../utils/db');


router.get('/friends', function (req, res, next) {
    // Get list of friends

    var friends = [];
    for(var i = 0; i < lokacije.length; i++) {
        friends.push(lokacije[i].person);
    }

    res.send({
        friends_list: friends
    });
});


module.exports = router;
