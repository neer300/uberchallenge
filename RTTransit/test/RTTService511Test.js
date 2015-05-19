var test = require('tape');
var RTTService511 = require('../controllers/services/RTTService511');
var httpProxy = require('./httpProxy');
var proxyquire = require('proxyquire');
var RTTService511 = proxyquire('../controllers/services/RTTService511', {
    'http': httpProxy
});

test('test 511 agency response', function (t) {
    var service511 = new RTTService511();
    var expected = ['AC Transit', 'BART'];
    var actual = [];
    service511.getAgencies(function (response) {
       t.ok(response, 'response should not be null');
       actual.push(response);
    });
    console.log(actual);
    console.log(expected);
    if (actual.length === expected.length) {
        t.ok(actual[0]===expected[0], 'AC Transit should be equal');
        t.ok(actual[1]===expected[1], 'AC Transit should be equal');
        t.end();
    } else {
        t.fail();
    }
});

test('test 511 routes response', function (t) {
    var service511 = new RTTService511();
    var result = [];
    service511.getRoutes('VTA', true, function (routeCode, directionCode) {
        result.push({
            routeCode: routeCode,
            directionCode: directionCode
        });
     });
    
    t.equal(result[0].routeCode, '10', 'Route code should be equal');
    t.equal(result[0].directionCode, 'East', 'Direction code should be equal');
    var length = result.length;
    t.equal(result[length - 1].routeCode, '914', 'Route code should be equal');
    t.equal(result[length - 1].directionCode, 'Outbound', 'Direction code should be equal');
    t.end();
});

test('test 511 stops', function (t) {
    var service511 = new RTTService511();
    var result = [];
    service511.getStops('VTA', 'rCode', 'dirCode', function (stopCode) {
        result.push(stopCode);
     });
    
    t.equal(result[0], '10', 'Route code should be equal');
    var length = result.length;
    t.equal(result[length - 1], '98', 'Stop code should be equal');
    t.end();
});

test('test 511 stops', function (t) {
    var service511 = new RTTService511();
    var result = [];
    service511.getDepartures('stopCode', function (list, routeCode) {
        result.push(list);
     });
    
    t.equal(result.length, 2, '2 departure lists found');
    var result1 = result[0];
    t.equal(result1[0], '2', '2 in departure lists');
    var result2 = result[1];
    var len = result2.length;
    t.equal(result2[len - 1], '100', '100 in departure lists');
    t.end();
});

/*
test('test get routeIDFs for agencies', function (t) {
    var service511 = new RTTService511();
    var agencyName = 'BART';
    service511.getRoutes(agencyName, false, function (response) {
        t.ok(response, 'response should not be null');
        t.equal(response.length, 9, '9 routes for BART');
        t.end();
    });
});

test('test get stops by idf', function (t) {
    var service511 = new RTTService511();
    service511.getStops('BART', '747', null, function (response) {
        t.ok(response, 'stop code should be returned');
        t.end();
    });
});

test('test get departures for stop code', function (t) {
    var service511 = new RTTService511();
    var stopCode = '73';
    service511.getDepartures('367', '73', function (response) {
        t.ok(response, 'departures should be returned');
        t.end();
    });
});*/
