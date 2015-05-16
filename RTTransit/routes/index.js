var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*var controller = req.controller;
  res.contentType('application/json');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(controller._allStops);*/
    console.log(req.allStops);
    var allStops = req.allStops;
    var agencies = [];
    for (var key in allStops) {
        if (allStops.hasOwnProperty(key)) {
            agencies.push(key);
        }
    }
    res.render('index', { agencies: agencies, all: JSON.stringify(allStops) });
});

router.get('/agency', function(req, res, next) {
    var allStops = req.allStops;
    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    var allStops = req.allStops;
    var agencies = [];
    for (var key in allStops) {
        if (allStops.hasOwnProperty(key)) {
            agencies.push(key);
        }
    }
    res.json(agencies);
});

module.exports = router;
