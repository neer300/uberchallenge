/**
 * New node file
 */

var DOMParser = require('xmldom').DOMParser;
var parser = new DOMParser();

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
