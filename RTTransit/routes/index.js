var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.allStops);
    var allStops = req.allStops;
    var agencies = [];
    for (var key in allStops) {
        if (allStops.hasOwnProperty(key)) {
            agencies.push(key);
        }
    }
    res.render('index', { agencies: agencies});
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
