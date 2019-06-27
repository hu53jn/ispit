var express = require('express');
var router = express.Router();

const db = require('../utils/db');

// /user

router.get('/id/:username', async function (req, res, next) {
    const id = await db.getUserID(req.params.username);
    if(id){
        res.send({
            id: id
        })
    }
});

router.get('/all', async function (req, res, next) {
    const all = await db.getAllUsers();
    res.send({
        list: all
    });
});


router.post('/add', async function (req, res, next) {
    var user = req.body.user;
    // dodati heshiranje

    var username = user.username;
    var password = user.password;

    const addUserSuccess = await db.addUser(username, password);

    if(addUserSuccess){
        const gen = await db.generateConversations(addUserSuccess);
        res.send({
            success: true
        })
    } else {
        res.send({
            success: false
        })
    }

    // Validation errorSequelizeUniqueConstraintError: Validation error
    // dodaj elif za vec postojeci username
});

router.post('/update/location', async function (req, res, next) {

    var location = req.body.location;
    var user = req.body.user;

    if(await db.updateUserLocation(user, location)){
        res.send({
            success: true
        });
    } else {
        res.send({
            success: true
        });
    }
});

router.post('/update/password', function (req, res, next) {

});

router.get('/conversations/:user', async function (req, res, next) {

    const user = req.params.user;
    const list = await db.getAllConversationsForUser(user);

    res.send({
        list: list[0]
        // id za podatke, ime za prikaz
    });
});

module.exports = router;
