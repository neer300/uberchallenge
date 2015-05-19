'use strict';

var test = require('tape');

var ParserManager = require('../controllers/parser/ParserManager');
var fs = require('fs');


test('testing basic xml parsing', function (t) {
    var xmlspecimen1 = fs.readFileSync(__dirname + '/xmldata/xmlspecimen1.xml', 'utf8');
    var specimenDOM = ParserManager.parseXml(xmlspecimen1);
    var agencyList = specimenDOM.getElementsByTagName('Agency');
    t.equal(agencyList.length, 1, 'Only 1 agency in this xml');
    var value = agencyList[0].getAttribute('Name');
    t.equal(value, 'SF-MUNI', 'The value should sf-muni');
    t.end();
});