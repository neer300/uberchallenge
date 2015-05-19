module.exports = BaseService;

var Model = require('../../models/Model');

/**
 * The Base Service. Base Service is an abstract class implementation
 * of various services which can fetch real time transit information of
 * public transportation agencies, routes and their stops.
 */
function BaseService () {
    var self = this;
}

/**
 * Called when a new agency is found by this service. A new agency item is
 * modeled and stored.
 * @param agencyName
 * @param hasDirection
 * @param mode
 */
BaseService.prototype.foundNewAgency = function (agencyName, hasDirection, mode) {
    var self = this;
    var newAgency = new Model.Agency(agencyName, hasDirection, mode);
    Model.addNewAgency(newAgency);
};

/**
 * Called when a new route for an agency named agencyName is found. A new route item
 * is modeled and stored.
 * @param agencyName
 * @param routeCode
 * @param routeName
 */
BaseService.prototype.foundNewRoute = function (agencyName, routeCode, routeName) {
    var self = this;
    var newRoute = new Model.Route(routeCode, routeName);
    Model.addNewRouteForAgency(agencyName, newRoute);
};

/**
 * Called when a new direction for an agency and route is found. A new direction item
 * is modeled and stored.
 * @param agencyName
 * @param routeCode
 * @param directionCode
 * @param directionName
 */
BaseService.prototype.foundNewDirection = function (agencyName, routeCode, directionCode, directionName) {
    var self = this;
    var newDirection = new Model.Direction(directionCode, directionName);
    Model.addNewDirectionForRoute(agencyName, routeCode, newDirection);
};

/**
 * Called when a new stop for an agency, route and direction is found. A new stop item
 * is modeled and stored.
 * @param agencyName
 * @param routeCode
 * @param directionCode
 * @param stopCode
 * @param stopName
 */
BaseService.prototype.foundNewStop = function (agencyName, routeCode, directionCode, stopCode, stopName) {
    var self = this;
    var newStop = new Model.Stop(stopCode, stopName);
    Model.addNewStopForDirection(agencyName, routeCode, directionCode, newStop);
};

/**
 * Called when a new departure is found when requested for an agency, route, direction and stop.
 * @param agencyName
 * @param routeCode
 * @param directionCode
 * @param stopCode
 * @param departureList
 */
BaseService.prototype.foundNewDepartures = function (agencyName, routeCode, directionCode, stopCode, departureList) {
    var self = this;
    Model.updateDeparturesForStop(agencyName, routeCode, directionCode, stopCode, departureList);
};

/**
 * Fetches and populates the model with all agencies supported by this service, their
 * corresponding routes, directions and stops. At this point however, the departures for
 * the stops are not fetched.
 */
BaseService.prototype.fetchAll = function () {
    var self = this;
    self.getAgencies(function (agencyName, hasDirection) {
        self.getRoutes(agencyName, hasDirection, function (routeCode, directionCode) {
            self.getStops(agencyName, routeCode, directionCode, function (stopCode) {
            });
        });
    });
};

/**
 * Routine responsible for getting all the agency information supported by
 * this service.
 * @param stopCode
 * @param cb
 */
BaseService.prototype.getAgencies = function (cb) {
    var self = this;
    return;// Base Class does nothing.
};

/**
 * Routine responsible for getting all the routes for provided agency
 * @param agencyName
 * @param hasDirection
 * @param cb
 */
BaseService.prototype.getRoutes = function (agencyName, hasDirection, cb) {
    var self = this;
    return;// Base Class does nothing.
};

/**
 * Routine responsible for getting all the stops for provided agency and route.
 * @param stopCode
 * @param cb
 */
BaseService.prototype.getStops = function (stopCode, cb) {
    var self = this;
    return;// Base Class does nothing.
};

/**
 * Routine to fetch departures for a given stop.
 * @param stopCode
 * @param cb
 */
BaseService.prototype.getDepartures = function (stopCode, cb) {
    var self = this;
    return;// Base Class does nothing.
};
