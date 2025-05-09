"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceInfo = void 0;
const ua_parser_js_1 = require("ua-parser-js");
/**
 * Extracts device and browser information from the user agent string.
 * @param {string} userAgent - The user agent string to parse.
 * @returns {string} - A formatted string with browser, OS, and device details.
 */
const deviceInfo = (userAgent) => {
    if (userAgent !== "Unknown") {
        const parser = new ua_parser_js_1.UAParser();
        const result = parser.setUA(userAgent).getResult();
        // Return formatted string with browser, OS, and device details
        return `User Agent - ${userAgent} | Browser - ${result.browser.name} 
                  | ${result.browser.version} \n OS - ${result.os.name} | ${result.os.version} \n Device - ${result.device.model}
                  | ${result.device.vendor} | ${result.device.type}`;
    }
    else {
        return "Unknown";
    }
};
exports.deviceInfo = deviceInfo;
