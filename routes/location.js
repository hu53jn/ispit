var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: 'uploads/'});

var lokacije = [];
var poruke = [];
var grupne_poruke = [];

router.post('/picture', upload.single('slika'), function(req, res, next){
    res.send({odg: req.file});
});


router.get('/location', function(req, res, next) {
    res.send({
        location_list: lokacije
    });
});


router.post('/location', function (req, res, next) {
   var new_location = {
       coordinate: {
           latitude: req.body.latitude,
           longitude: req.body.longitude
       },
       person: req.body.person,
       time: req.body.time
   };

   var new_poruka = {
       to: req.body.person,
       messages: [
       {
           from: 'admin',
           text: 'welcome to our app',
           time: req.body.time
       },
       ]
   };

   lokacije.push(new_location);
   poruke.push(new_poruka);
   res.send({
       success: true
   });

});

router.get('/location/reset', function (req, res, next){
    lokacije = [];
    res.send({
        success: true
    });
});


router.get('/friends', function (req, res, next) {
    var friends = [];
    for(var i = 0; i < lokacije.length; i++) {
        friends.push(lokacije[i].person);
    }

    res.send({
        friends_list: friends
    });
});

router.get("/friend/group", function (req, res, next) {
    res.send({
        poruke_list: grupne_poruke
    });
});

router.post("/friend/group", function (req, res, next) {
    var new_message = {
        from: req.body.user,
        text: req.body.text,
        time: req.body.time
    };

    grupne_poruke.push(new_message);
    res.send({
        success: JSON.stringify(new_message)
    });
});


router.get('/friend/:to/:from', function (req, res, next) {
    var to = req.params.to;
    var from = req.params.form;


    var poruke_list = [];
    for(var i = 0; i < poruke.length; i++){
        if(poruke[i].to === to){
            for(var j = 0; j < poruke[i].messages.length; j++){
                if(poruke[i].messages[j].from === from){
                    poruke_list.push(poruke[i].messages[j]);
                }
            }
            res.send({
                poruke_list: poruke_list
            });
            break;
        }
    }
});

router.post('/friend/:to', function (req, res, next) {
    var to = req.params.to;

    var new_message = {
        from: req.body.user,
        text: req.body.text,
        time: req.body.time
    };

    for(var i = 0; i < poruke.length; i++){
      if(poruke[i].to === to){
          poruke[i].messages.push(new_message);
          break;
      }
    }
    res.send({
        success: true
    })
});



module.exports = router;
