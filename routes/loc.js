var express = require('express');
var router = express.Router();

const db = require('../utils/db');

// /location

router.post('/add', async function (req, res, next) {

    var location = req.body.location;
    if(db.addLocation(location)){
        res.send({
            success: true
        })
    } else {
        res.send({
            success: false
        })
    }
});

router.get('/active_users', async function (req, res, next) {
    var list = await db.getCurrentUserLocations();
    res.send({
       list: list
    });
});


module.exports = router;
