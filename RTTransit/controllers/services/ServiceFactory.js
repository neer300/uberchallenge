'use strict'

var Constants = require('../common/constants');
var RTTService511 = require('./RTTService511');

/**
 * The public method to fetch a service using its name
 */
exports.getServiceByName = function (name) {
    if (name === Constants.SERVICE_511) {
        return new RTTService511();
    } else { // No Other implementations yet
        return null;
    }
}
