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

function Stop (stopCode, stopName) {
    var self = this;
    self.stopCode = stopCode;
    self.stopName = stopName;
    self.lastUpdated = 0;
}

Stop.prototype.update = function (departureList) {
    var self = this;
    self.departureList = departureList;
    self.lastUpdated = new Date().getTime();
};

function Direction (directionCode, directionName) {
    var self = this;
    self.directionName = directionName;
    self.directionCode = directionCode;
    self.stops = {};
}

Direction.prototype.addStop = function (stop) {
    var self = this;
    if (stop) {
        self.stops[stop.stopCode] = stop;
    }
};

Direction.prototype.getStop = function (stopCode) {
    var self = this;
    if (stopCode) {
        return self.stops[stopCode];
    }
    return null;
};

Direction.prototype.getAllStops = function () {
    var self = this;
    var result = [];
    for (var key in self.stops) {
        if (self.stops.hasOwnProperty(key)) {
            result.push(key);
        }
    }
    return result;
}

function Route (code, routeName) {
    var self = this;
    self.routeName = routeName;
    self.code = code;
    self.directions = {};
}

Route.prototype.addDirection = function (directionObj) {
    var self = this;
    if (directionObj) {
        self.directions[directionObj.directionCode] = directionObj;
    }
};

Route.prototype.getDirection = function (code) {
    var self = this;
    if (code) {
        return self.directions[code];
    }
    return null;
};

Route.prototype.getAllDirections = function () {
    var self = this;
    var result = [];
    for (var key in self.directions) {
        if (self.directions.hasOwnProperty(key)) {
            result.push(key);
        }
    }
    return result;
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
        var routeCode = routeObj.code;
        self.routes[routeCode] = routeObj;
    }
};

Agency.prototype.getRoute = function (routeCode) {
    var self = this;
    var routeObj = self.routes[routeCode];
    return routeObj;
};

Agency.prototype.getAllRouteCodes = function () {
    var self = this;
    var result = [];
    for (var key in self.routes) {
        if (self.routes.hasOwnProperty(key)) {
            result.push(key);
        }
    }
    return result;
};

var allData = {}; // No need for DB. Model is populated on every startup or after definite interval.

module.exports.addNewAgency = function addNewAgency (agencyObj) {
    allData[agencyObj.name] = agencyObj;
};

module.exports.addNewRouteForAgency = function (agencyName, routeObj) {
    var agencyObj = allData[agencyName];
    if (agencyObj) {
        agencyObj.addRoute(routeObj);
    }
};

module.exports.addNewDirectionForRoute = function (agencyName, routeCode, directionObj) {
    var agencyObj = allData[agencyName];
    if (agencyObj) {
        var routeObj = agencyObj.getRoute(routeCode);
        if (routeObj) {
            routeObj.addDirection(directionObj);
        }
    }
}

module.exports.addNewStopForDirection = function (agencyName, routeCode, directionCode, stopObj) {
    var agencyObj = allData[agencyName];
    if (agencyObj) {
        var routeObj = agencyObj.getRoute(routeCode);
        if (routeObj) {
            var dirObj = routeObj.getDirection(directionCode);
            if (dirObj) {
                dirObj.addStop(stopObj);
            }
        }
    }
};

module.exports.updateDeparturesForStop = function (agencyName, routeCode, directionCode, stopCode, departureList) {
    var agencyObj = allData[agencyName];
    if (agencyObj) {
        var routeObj = agencyObj.getRoute(routeCode);
        if (routeObj) {
            var dirObj = routeObj.getDirection(directionCode);
            if (dirObj) {
                var stopObj = dirObj.getStop(stopCode);
                if (stopObj) {
                    for (var index = 0; index < departureList.length; index++) {
                        departureList[index] = parseInt(departureList[index]);
                    }
                    departureList.sort();
                    stopObj.update(departureList);
                }
            }
        }
    }
};

module.exports.getAllAgencies = function () {
    var result = [];
    for (var key in allData) {
        if (allData.hasOwnProperty(key)) {
            result.push(key);
        }
    }
    return result;
};

module.exports.getAgency = function (name) {
    var agencyObj = allData[name];
    if (agencyObj) {
        return agencyObj;
    }
}