var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
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

router.get('/:agencyName', function (req, res, next) {
    var allStops = req.allStops;
    
    var agencyName = req.params.agencyName;
    var agencyObj = allStops[agencyName] || {};
    var routeArray = agencyObj.routeArray || [];
    var result = [];
    routeArray.forEach(function(item) {
        result.push({
            name: item.name,
            code: item.code
        });
    });
    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(result);
});

router.get('/:agencyName/:routeCode', function (req, res, next) {
    var allStops = req.allStops;
    
    var agencyName = req.params.agencyName;
    var agencyObj = allStops[agencyName] || {};
    var routeArray = agencyObj.routeArray || [];
});


module.exports = router;
