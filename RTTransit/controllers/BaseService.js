module.exports = BaseService;

var Model = require('../models/Model');

function BaseService () {
    var self = this;
}

BaseService.prototype.foundNewAgency = function (agencyName, hasDirection, mode) {
    var self = this;
    var newAgency = new Model.Agency(agencyName, hasDirection, mode);
    Model.addNewAgency(newAgency);
};

BaseService.prototype.foundNewRoute = function (agencyName, routeCode, routeName) {
    var self = this;
    var newRoute = new Model.Route(routeCode, routeName);
    Model.addNewRouteForAgency(agencyName, newRoute);
};

BaseService.prototype.foundNewDirection = function (agencyName, routeCode, directionCode, directionName) {
    var self = this;
    var newDirection = new Model.Direction(directionCode, directionName);
    Model.addNewDirectionForRoute(agencyName, routeCode, newDirection);
};

BaseService.prototype.foundNewStop = function (agencyName, routeCode, directionCode, stopCode, stopName) {
    var self = this;
    var newStop = new Model.Stop(stopCode, stopName);
    Model.addNewStopForDirection(agencyName, routeCode, directionCode, newStop);
};

BaseService.prototype.foundNewDepartures = function (agencyName, routeCode, directionCode, stopCode, departureList) {
    var self = this;
    Model.updateDeparturesForStop(agencyName, routeCode, directionCode, stopCode, departureList);
};

BaseService.prototype.fetchAll = function () {
    var self = this;
    self.getAgencies(function (agencyName, hasDirection) {
        self.getRoutes(agencyName, hasDirection, function (routeCode, directionCode) {
            self.getStops(agencyName, routeCode, directionCode, function (stopCode) {
            });
        });
    });
};

BaseService.prototype.getDepartures = function (stopCode, cb) {
    var self = this;
    return;// Base Class does nothing.
};
