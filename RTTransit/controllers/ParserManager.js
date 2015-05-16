/**
 * New node file
 */

var DOMParser = require('xmldom').DOMParser;
var parser = new DOMParser();

var xml2js = require('xml2js');
var xml2jsParser = new xml2js.Parser();
var util = require('util');

function cleanXml (xmlString) {
    var xml = xmlString;
    if (xml) {
        // Remove new lines
        xml = xml.replace(/\w(\r\n|\n|\r)\w/gm,"");
        // Remove white spaces between tags
        xml = xml.replace(/>\s+</g, '><');
        // Remove comments from the xml
        xml = xml.replace(/<!--[\s\S]*?-->/g, '');
    }
    return xml;
}

exports.parseXml = function (xmlString) {
    var xml = cleanXml(xmlString);
    return parser.parseFromString(xml, 'application/xml');
};

exports.parseXmlUsingXml2js = function (xmlString, cb) {
    var xml = cleanXml(xmlString);
    xml2jsParser.parseString(xmlString, function (err, result) {
        //console.log(util.inspect(result, false, null));
    });
}

