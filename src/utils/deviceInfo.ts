import { UAParser } from "ua-parser-js";

/**
 * Extracts device and browser information from the user agent string.
 * @param {string} userAgent - The user agent string to parse.
 * @returns {string} - A formatted string with browser, OS, and device details.
 */
export const deviceInfo = (userAgent: string): string => {
  if (userAgent !== "Unknown") {
    const parser = new UAParser();
    const result = parser.setUA(userAgent).getResult();

    // Return formatted string with browser, OS, and device details
    return `User Agent - ${userAgent} | Browser - ${result.browser.name} 
                  | ${result.browser.version} \n OS - ${result.os.name} | ${result.os.version} \n Device - ${result.device.model}
                  | ${result.device.vendor} | ${result.device.type}`;
  } else {
    return "Unknown";
  }
};
