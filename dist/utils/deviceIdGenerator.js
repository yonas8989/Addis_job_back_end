"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceIdGenerator = void 0;
const uuid_1 = require("uuid");
/**
 * Generates a unique device ID by combining the user ID and a UUID.
 * @param {string} userId - The user ID to be included in the device ID.
 * @returns {string} - The generated device ID.
 */
const deviceIdGenerator = (userId) => {
    return `${userId}-${(0, uuid_1.v4)()}`; // Combine user ID and UUID
};
exports.deviceIdGenerator = deviceIdGenerator;
