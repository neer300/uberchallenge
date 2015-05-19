'use strict';
var test = require('tape');
var Model = require('../models/Model');
var BaseService = require('../controllers/services/BaseService');

test('test found new agency', function(t) {
    var service = new BaseService();
    service.foundNewAgency('agencyName', true, 'mode');
    var agencyObj = Model.getAgency('agencyName');
    t.ok(agencyObj, 'agencyObj should be non null');
    t.equal(agencyObj.name, 'agencyName', 'name is equal');
    t.ok(agencyObj.hasDirection, 'has direction is true');
    t.equal(agencyObj.mode, 'mode', 'Mode should be equal');
    t.end();
});

test('test found new route with valid agency', function (t) {
    var service = new BaseService();
    service.foundNewRoute('agencyName', 'code', 'rname');
    
    var agencyObj = Model.getAgency('call');
    t.notOk(agencyObj, 'agency obj should be null');
    
    agencyObj = Model.getAgency('agencyName');
    t.ok(agencyObj, 'agencyObj should be non null');
    var routeObj = agencyObj.getRoute('code');
    t.equal(routeObj.routeName, 'rname', 'name is equal');
    t.equal(routeObj.code, 'code', 'code is equal');
    t.end();
});

test('test found new route with invalid agency', function (t) {
    var service = new BaseService();
    service.foundNewRoute('blah', 'code', 'rname');
    
    var agencyObj = Model.getAgency('blah');
    t.notOk(agencyObj, 'no such agency exists ahead of foundNewRoute, nothing is added to model');
    t.end();
});

test('test found new direction', function (t) {
    var service = new BaseService();
    service.foundNewDirection('agencyName', 'code', 'dirCode', 'dirName');
    
    var agencyObj = Model.getAgency('agencyName');
    t.ok(agencyObj, 'agencyObj should be non null');
    var routeObj = agencyObj.getRoute('code');
    t.ok(routeObj, 'routeObj should be non null');
    
    var dirObj = routeObj.getDirection('dirCode');
    t.ok(dirObj, 'routeObj should be non null');
    t.equal(dirObj.directionName, 'dirName', 'name is equal');
    t.equal(dirObj.directionCode, 'dirCode', 'code is equal');
    t.end();
});

test('test found new stops', function (t) {
    var service = new BaseService();
    service.foundNewStop('agencyName', 'code', 'dirCode', 'stopCode', 'stopName');
    
    var agencyObj = Model.getAgency('agencyName');
    t.ok(agencyObj, 'agencyObj should be non null');
    var routeObj = agencyObj.getRoute('code');
    t.ok(routeObj, 'routeObj should be non null');
    var dirObj = routeObj.getDirection('dirCode');
    t.ok(dirObj, 'routeObj should be non null');
    
    var stopObj = dirObj.getStop('stopCode');
    t.ok(stopObj, 'stopObj should be non null');
    t.equal(stopObj.stopCode, 'stopCode', 'code is equal');
    t.equal(stopObj.stopName, 'stopName', 'name is equal');
    t.end();
});

test('test found departures', function (t) {
    var service = new BaseService();
    service.foundNewDepartures('agencyName', 'code', 'dirCode', 'stopCode', ['2', '1000', '43']);

    var agencyObj = Model.getAgency('agencyName');
    t.ok(agencyObj, 'agencyObj should be non null');
    var routeObj = agencyObj.getRoute('code');
    t.ok(routeObj, 'routeObj should be non null');
    var dirObj = routeObj.getDirection('dirCode');
    t.ok(dirObj, 'routeObj should be non null');
    var stopObj = dirObj.getStop('stopCode');
    t.ok(stopObj, 'stopObj should be non null');

    var departureList = stopObj.departureList;
    t.equal(departureList[0], 2, 'first should be 2');
    t.equal(departureList[1], 43, 'second should be 43');
    t.equal(departureList[2], 1000, 'second should be 1000');
    t.end();
});