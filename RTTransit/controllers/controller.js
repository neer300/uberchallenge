/**
 * New node file
 */

module.exports = Controller;
var Model = require('../models/Model');
var RTTService511 = require('./RTTService511');

function Controller (cb) {
    var self = this;

    //Utilize the 511 service to initialize the model
    var service = new RTTService511();

    self._allStops = {};
    service.getAgencies(function (agencies) {
        if (agencies) {
            for (var index = 0; index < agencies.length; index++) {
                var agencyObj = agencies[index];
                self._allStops[agencyObj.name] = agencyObj;
                service.getRoutes(agencyObj.name, agencyObj.hasDirection, function (routeArray) {
                    agencyObj.routeArray = routeArray;
                    for (var j = 0; j < routeArray.length; j++) {
                        var routeItem = routeArray[j];
                        var directionArray = routeItem.directionArray || [];
                        for (var k = 0; k < directionArray.length; k++) {
                            var directionItem = directionArray[k];
                            service.getStops(agencyObj.name, routeItem.code, directionItem.code, function (stops) {
                                directionItem.stops = stops;
                                console.log(allStops);
                                cb();
                            });
                        }
                    }
                });
            }
        }
    });
}