'use strict';

var fs = require('fs');
var agencyList = fs.readFileSync(__dirname + '/xmldata/agencyList.xml', 'utf8');
var VTARoutes = fs.readFileSync(__dirname + '/xmldata/VTARoutes.xml', 'utf8');
var stops = fs.readFileSync(__dirname + '/xmldata/stops.xml', 'utf8');
var departureTimes = fs.readFileSync(__dirname + '/xmldata/departureTimes.xml', 'utf8');
var mockRequest = require('mock-request')

exports.get = function (url, callback) {
    var httpResponse = '';
    var result = {
            setEncoding: function () {},
            on: function (event, cb) {
                if (event === 'data') {
                    cb(httpResponse);
                } else if (event === 'end') {
                    cb();
                }
            }
    };
    if (url.indexOf('GetAgencies.aspx') > -1) {
        httpResponse = agencyList;
    } else if (url.indexOf('GetRoutesForAgency.aspx') > -1) {
        httpResponse = VTARoutes; 
    } else if (url.indexOf('GetStopsForRoute.aspx') > -1) {
        httpResponse = stops;
    } else if (url.indexOf('GetNextDeparturesByStopCode.aspx') > -1) {
        httpResponse = departureTimes;
    }
    callback(result);
};