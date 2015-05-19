var express = require('express');
var Model = require('../models/Model');
var router = express.Router();
var Errors = require('../controllers/common/errors');
var Constants = require('../controllers/common/constants');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var result = [];
    var agencies = Model.getAllAgencies();

    res.render('index', { agencies: agencies});
});

router.get('/agencies', function(req, res, next) {
    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    var agencies = Model.getAllAgencies() || [];
    var result = [];
    agencies.forEach(function (item) {
        var agencyObj = Model.getAgency(item);
        result.push({
            code: agencyObj.name,
            name: agencyObj.name
        })
    });
    res.json(result);
});

router.get('/:agencyName/routes', function (req, res, next) {
    var agencyName = req.params.agencyName;
    var agencyObj = Model.getAgency(agencyName);
    var result = [];
    var err;
    if (agencyObj) {
        var routeArray = agencyObj.getAllRouteCodes();
        routeArray.forEach(function(item) {
            var routeObj = agencyObj.getRoute(item);
            var directionArray = routeObj.getAllDirections() || [];
            var dirArray = [];
            directionArray.forEach(function (dirCode) {
                var dirObj = routeObj.getDirection(dirCode);
                dirArray.push({
                    name: dirObj.directionName,
                    code: dirObj.directionCode
                });
            });
            result.push({
                name: routeObj.routeName,
                code: routeObj.code,
                directionArray: dirArray
            });
        });
    } else {
        result = {
                err: Errors.ERR_INVALID_AGENCY_NAME
        };
    }

    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(result);
});

router.get('/:agencyName/:routeCode/:directionCode/stops', function (req, res, next) {
    var agencyName = req.params.agencyName;
    var routeCode = req.params.routeCode;
    var directionCode = req.params.directionCode;
    var result;
    var agencyObj = Model.getAgency(agencyName);

    if (agencyObj) {
        var routeObj = agencyObj.getRoute(routeCode);
        if (routeObj) {
            var dirObj = routeObj.getDirection(directionCode);
            if (dirObj) {
                var stopCodeArray = dirObj.getAllStops() || [];
                result = [];
                stopCodeArray.forEach(function (item) {
                    var stopObj = dirObj.getStop(item);
                    result.push({
                        code: stopObj.stopCode,
                        name: stopObj.stopName
                    });
                });
            } else {
                result = {
                        err: Errors.ERR_INVALID_DIRECTION_CODE
                };
            }
        } else {
            result = {
                    err: Errors.ERR_INVALID_ROUTE_CODE
            };
        }
    } else {
        result = {
                err: Errors.ERR_INVALID_AGENCY_NAME
        };
    }
    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(result);
});

router.get('/:agencyName/:routeCode/:directionCode/:stopCode/departures', function (req, res, next) {
    var currentTime = new Date().getTime();
    var agencyName = req.params.agencyName;
    var routeCode = req.params.routeCode;
    var directionCode = req.params.directionCode;
    var stopCode = req.params.stopCode;
    var agencyObj = Model.getAgency(agencyName);
    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (agencyObj) {
        var routeObj = agencyObj.getRoute(routeCode);
        if (routeObj) {
            var dirObj = routeObj.getDirection(directionCode);
            if (dirObj) {
                var stopObj = dirObj.getStop(stopCode);
                if (stopObj) {
                    var lastUpdated = stopObj.lastUpdated;
                    if ((currentTime - lastUpdated) > Constants.DEPARTURE_REFRESH_INTERVAL) { // If more than 30 sec
                        var service = req.service;
                        service.getDepartures(stopCode, function (departList, currentRouteCode) {
                            if (currentRouteCode === routeCode) {
                                result = departList;
                                res.json(result);
                            }
                        });
                        return; // wait for the callback
                    } else {
                        result = stopObj.departureList;
                    }
                } else {
                    result = {
                            err: Errors.ERR_INVALID_STOP_CODE
                    };
                }
            } else {
                result = {
                        err: Errors.ERR_INVALID_DIRECTION_CODE
                };
            }
        } else {
            result = {
                    err: Errors.ERR_INVALID_ROUTE_CODE
            };
        }
    } else {
        result = {
                err: Errors.ERR_INVALID_AGENCY_NAME
        };
    }
    res.json(result);
});

module.exports = router;
