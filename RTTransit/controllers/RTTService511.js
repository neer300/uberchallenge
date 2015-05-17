/**
 * New node file
 */
module.exports = RTTService511;

var http = require('http');
var xmlParser = require('xml2js').parseString;
var ParserManager = require('./ParserManager');
var BaseService = require('./BaseService');
var util = require('util');

util.inherits(RTTService511, BaseService);

function RTTService511 () {
    var self = this;
    BaseService.call();
    self._token = '8e4100f1-cddc-4a1d-8391-c0f28003ecac';
    self._serviceUrl = 'http://services.my511.org/Transit2.0/';
}

RTTService511.prototype.createUrl = function (methodName) {
    var self = this;
    return self._serviceUrl + methodName + '?token=' + self._token;
};

RTTService511.prototype.getAgencies = function (cb) {
    var self = this;
    var method = 'GetAgencies.aspx';
    var url = self.createUrl(method);
    console.log('url:' + url);
    http.get(url, function (res) {
        res.setEncoding('utf8');
        var datachunk = '';
        res.on('data', function (chunk) {
            datachunk += chunk;
        });
        res.on('end', function () {
            var xmlDom = ParserManager.parseXml(datachunk);
            var agencyDomList = xmlDom.getElementsByTagName('Agency');
            var agencyNames = [];
            for (var i = 0; i < agencyDomList.length; i++) {
                var item = agencyDomList[i];
                var name = item.getAttribute('Name');
                var hasDirection = item.getAttribute('HasDirection') === 'True';
                var mode = item.getAttribute('Mode');
                agencyNames.push({
                    name: name,
                    hasDirection: hasDirection,
                    mode: mode
                });
                self.foundNewAgency(name, hasDirection, mode);
                cb(name, hasDirection);
            }
        });
    });
};

RTTService511.prototype.getRoutes = function (name, hasDirection, cb) {
    var self = this;
    var method = 'GetRoutesForAgency.aspx';
    var url = self.createUrl(method);
    url = url + '&agencyName=' + name;
    console.log(url);
    var routeIDFs = [];
    http.get(url, function (res) {
        res.setEncoding('utf-8');
        var chunk = '';
        res.on('data', function (data) {
            chunk += data; 
        });
        
        res.on('end', function () {
            try {
                var xmlDom = ParserManager.parseXml(chunk);
                var routeArray = [];
                var routeList = xmlDom.getElementsByTagName('Route');
                for (var j = 0; j < routeList.length; j++) {
                    var routeItem = routeList[j];
                    var routeName = routeItem.getAttribute('Name');
                    var routeCode = routeItem.getAttribute('Code');
                    var routeObj = {
                            name: routeName,
                            code: routeCode,
                            directionArray: []
                    };
                    self.foundNewRoute(name, routeCode, routeName);
                    var directionArray = routeObj.directionArray;
                    if (hasDirection) {
                        var routeDirectionList = routeItem.getElementsByTagName('RouteDirection');
                        for (var k = 0; k < routeDirectionList.length; k++) {
                            var directionItem = routeDirectionList[k];
                            var directionCode = directionItem.getAttribute('Code');
                            var directionName = directionItem.getAttribute('Name');
                            var directionObj = {
                                    code: directionCode,
                                    name: directionName
                            };
                            routeObj.directionArray.push(directionObj);
                            self.foundNewDirection(name, routeCode, directionCode, directionName);
                            cb(routeCode, directionCode);
                        }
                    } else {
                        self.foundNewDirection(name, routeCode, '', '');
                        cb(routeCode, '');
                    }
                    routeArray.push(routeObj);
                }
                //cb(routeArray, name);
            } catch (ex) {
                console.log(ex);
                console.log('exception happened');
                cb(null);
            }
        });
    });
};

RTTService511.prototype.getStops = function (agencyName, routeCode, directionCode, cb) {
    var self = this;
    var method = 'GetStopsForRoute.aspx';
    var url = self.createUrl(method);
    directionCode = directionCode || '';
    var routeIDF = agencyName + '~' + routeCode + '~' + directionCode;
    url = url + '&routeIDF=' + routeIDF;
    console.log(url);
    var stops = [];
    http.get(url, function (res) {
        var datachunk = '';
        res.setEncoding('utf-8');
        res.on('data', function (chunk) {
            datachunk += chunk;
        });

        res.on('end', function () {
            try {
                var xmlDom = ParserManager.parseXml(datachunk);
                var stopList = xmlDom.getElementsByTagName('Stop');
                for (var index = 0; index < stopList.length; index++) {
                    var item = stopList[index];
                    var stopName = item.getAttribute('name');
                    var stopCode = item.getAttribute('StopCode');
                    stops.push({
                        name: stopName,
                        code: stopCode
                    });
                    self.foundNewStop(agencyName, routeCode, directionCode, stopCode, stopName);
                    cb(stopCode);
                }
                //cb(stops);
            } catch (err) {
                //cb(null);
            }
        });
    });
};

RTTService511.prototype.getDepartures = function (stopCode, cb) {
    var self = this;
    var method = 'GetNextDeparturesByStopCode.aspx';
    var url = self.createUrl(method);
    url = url + '&stopCode=' + stopCode;
    console.log(url);
    var departureList = {};
    http.get(url, function (res) {
        res.setEncoding('utf-8');
        var datachunk = '';
        res.on('data', function (chunk) {
            datachunk += chunk;
        });
        res.on('end', function () {
            try {
                var xmlDom = ParserManager.parseXml(datachunk);
                var agencyList = xmlDom.getElementsByTagName('Agency');

                for (var i = 0; i < agencyList.length; i++) {
                    var agencyItem = agencyList[i];
                    var agencyName = agencyItem.getAttribute('Name');
                    var routeList = agencyItem.getElementsByTagName('Route');
                    
                    for (var j = 0; j < routeList.length; j++) {
                        var localDeparture = [];
                        var routeItem = routeList[j];
                        var routeDirection = routeItem.getElementsByTagName('RouteDirection');
                        var directionCode = routeDirection.getAttribute('Code');
                        var departures = routeItem.getElementsByTagName('DepartureTime');
                        var routeCode = routeItem.getAttribute('Code');
                        for (var k = 0; k < departures.length; k++) {
                            localDeparture.push(departures[k].textContent);
                        }
                        self.foundNewDepartures(agencyName, routeCode, directionCode, stopCode, localDeparture);
                    }
                }
                cb(localDeparture);
            } catch (ex) {
                cb(null);
            }
        });
    });
};
