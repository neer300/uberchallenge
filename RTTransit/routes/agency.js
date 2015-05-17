var express = require('express');
var Model = require('../models/Model');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    var agencies = Model.getAllAgencies();
    res.json(agencies);
});

router.get('/:agencyName/routes', function (req, res, next) {
    var agencyName = req.params.agencyName;
    var agencyObj = Model.getAgency(agencyName);
    var routeArray = agencyObj.getAllRouteCodes();
    var result = [];
    routeArray.forEach(function(item) {
        var routeObj = agencyObj.getRoute(item);
        result.push({
            name: routeObj.routeName,
            code: routeObj.code
        });
    });
    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(result);
});

router.get('/:agencyName/:routeCode/directions', function (req, res, next) {
    var allStops = req.allStops;
    
    var agencyName = req.params.agencyName;
    var agencyObj = allStops[agencyName] || {};
    var routeArray = agencyObj.routeArray || [];
});


module.exports = router;
