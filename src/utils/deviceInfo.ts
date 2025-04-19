import { UAParser } from "ua-parser-js";

/**
 * Extracts and formats device information from a user agent string
 * @param {string} userAgent - The user agent string to parse
 * @returns {string} - Formatted string containing device, browser, and OS information
 *                    Returns "Unknown" if the user agent is "Unknown"
 */

export const deviceInfo = (userAgent: string): string => {
  // Check if the user agent is not "Unknown"
  if (userAgent !== "Unknown") {
    // Create a new UAParser instance
    const parser = new UAParser();
    // Parse the user agent string and get the result
    const result = parser.setUA(userAgent).getResult();

    // Return a formatted string containing:
    // - User Agent string
    // - Browser name and version
    // - Operating System name and version
    // - Device model, vendor, and type
    return `User Agent - ${userAgent} | Browser - ${result.browser.name} | ${result.browser.version} \n OS - ${result.os.name} | ${result.os.version} \n Device - ${result.device.model} | ${result.device.vendor} | ${result.device.type}`;
  } else {
    // Return "Unknown" if the user agent is "Unknown"
    return "Unknown";
  }
};
