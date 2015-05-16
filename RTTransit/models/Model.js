/**
 * New node file
 */
module.exports = {
        Agency: Agency,
        Route: Route,
        Direction: Direction,
        Stop: Stop
};

var allStops = {};

function Stop (stopCode, departureList) {
    var self = this;
    self.stopCode = stopCode;
    self.departureList = departureList;
    self.lastUpdated = new Date().getTime();
}

Stop.prototype.update = function (departureList) {
    var self = this;
    self.departureList = departureList;
    self.lastUpdated = new Date().getTime();
};

function Direction (directionName) {
    var self = this;
    self.directionName = directionName;
    self.stopCodes = {};
}

Direction.prototype.addStop = function (stopCode, stop) {
    var self = this;
    if (stopCode && stop) {
        self.stopCodes[stopCode] = stop;
    }
};

Direction.prototype.getStop = function (stopCode) {
    var self = this;
    if (stopCode) {
        return self.stopCodes[stopCode];
    }
    return null;
};

function Route (routeName, code) {
    var self = this;
    self.routeName = routeName;
    self.code = code;
    self.directions = {};
}

Route.prototype.addDirection = function (directionObj, code) {
    var self = this;
    if (code && directionObj) {
        self.directions[code] = directionObj;
    }
};

Route.prototype.getDirection = function (code) {
    var self = this;
    if (code) {
        return self.directions[code];
    }
    return null;
};

function Agency (name, hasDirection, mode) {
    var self = this;
    self.name = name;
    self.hasDirection = hasDirection;
    self.mode = null;
    self.routes = {};
}

Agency.prototype.addRoute = function (routeObj) {
    var self = this;
    if (routeObj && routeObj instanceof Route) {
        var routeName = routeObj.routeName;
        self.routes[routeName] = routeObj;
    }
};

Agency.prototype.getRoute = function (routeName) {
    var self = this;
    var routeObj = self.routes[routeName];
    return routeObj;
};

var allData = {};

exports.add = function (agency, route, direction, stopCode, departureList) {
    agency = agency.toLowerCase();
    route = route.toLowerCase();
    direction = direction.toLowerCase();

    var agencyObj = allData[agency] || new Agency(agency);
    allData[agency] = agencyObj;

    var routeObj = agency.getRoute() || new Route(route);
    agencyObj.addRoute(routeObj);

    var directionObj = routeObj.getDirection(direction) || new Direction(direction);
    routeObj.addDirection(directionObj);

    var stopObj = directionObj.getStop(stopCode) || new Stop(stopCode, departureList);
    stopObj.update(departureList);
    directionObj.addStop(stopObj);
};

exports.get = function (agency, route, direction, stopCode) {
    var agencyObj = allData[agency];
    if (agencyObj) {
        var routeObj = agencyObj.getRoute(route);
        if (routeObj) {
            var directionObj = routeObj.getDirection(direction);
            if (directionObj) {
                return directionObj.getStop(stopCode);
            }
        }
    }
};

exports.update = function (agency, route, direction, stopCode, newDepartureList) {
    var agencyObj = allData[agency];
    if (agencyObj) {
        var routeObj = agencyObj.getRoute(route);
        if (routeObj) {
            var directionObj = routeObj.getDirection(direction);
            if (directionObj) {
                var stopObj = directionObj.getStop(stopCode);
                if (stopObj) {
                    stopObj.update(newDepartureList);
                }
            }
        }
    }
};