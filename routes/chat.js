var express = require('express');
let router = express.Router();

const db = require('../utils/db');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now())
    }
});
const upload = multer({
    storage: storage
});

// /chat

router.get('/all', async function (req, res, next) {

});

router.post('/picture', upload.single('slika'), async function(req, res, next){
    var rez = await db.addImage(req.file.path);
    if(rez){
        res.send({
            success: true
        });
    } else {
        res.send({
            success: true
        });
    }

});

router.post('/message/send', async function (req, res, next) {

    var id_from = req.body.id_from;
    var text = req.body.text;
    var conv_id = req.body.conv_id;

    const rez = await db.addMessage(id_from, text, null, conv_id);
    if(rez){
        res.send({
            success: true
        });
    } else {
        res.send({
            success: false
        });
    }

});

router.post('/message/sendImg', upload.single('slika'), function (req, res, next) {
    res.send({
        res: req.file
    });
});

router.get('/message/load/:conversationID', async function (req, res, next) {
    const messages = await db.getAllMessagesFromConversation(req.params.conversationID);
    if(messages){
        res.send({
            messages: messages
        });
    } else {
        res.send({
            tugy: "plaky"
        });
    }
});


module.exports = router;
