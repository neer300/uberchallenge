module.exports = BaseService;

var Model = require('../models/Model');

function BaseService () {
    var self = this;
}

BaseService.prototype.foundNewAgency = function (agencyName, hasDirection, mode) {
    var self = this;
    var newAgency = new Model.Agency(agencyName, hasDirection, mode);
};

BaseService.prototype.foundNewRoute = function (agencyName, routeCode, routeName) {
    var self = this;
};

BaseService.prototype.foundNewDirection = function (agencyName, routeCode, directionCode, directionName) {
    var self = this;
};

BaseService.prototype.foundNewStop = function (agencyName, routeCode, directionCode, stopCode, stopName) {
    var self = this;
};
