var test = require('tape');
var RTTService511 = require('../controllers/RTTService511');

test('test 511 agency response', function (t) {
    var service511 = new RTTService511();
    service511.getAgencies(function (response) {
       t.ok(response, 'response should not be null');
       t.equal(response[0].name, 'AC Transit', 'AC Transit must be the first one');
       t.end();
    });
});


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
});
