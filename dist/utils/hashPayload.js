"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPayload = void 0;
const bcryptjs_1 = require("bcryptjs");
/**
 * Hashes the provided payload using bcrypt with a salt round of 12.
 * @param {string} payload - The data to be hashed.
 * @returns {string} - The hashed result.
 */
const hashPayload = (payload) => {
    return (0, bcryptjs_1.hashSync)(payload, 12);
};
exports.hashPayload = hashPayload;
