'use strict'

var DOMParser = require('xmldom').DOMParser;
var parser = new DOMParser();

/**
 * Cleans the xml string off white spaces, new lines and commented sections
 * @param xmlString
 * @returns
 */
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

/**
 * Parses the input string and returns DOM representation.
 * @param {string} xmlString The XML string to parse
 * @return {DOM} The DOM tree representing the xml document
 */
exports.parseXml = function (xmlString) {
    var xml = cleanXml(xmlString);
    return parser.parseFromString(xml, 'application/xml');
};
