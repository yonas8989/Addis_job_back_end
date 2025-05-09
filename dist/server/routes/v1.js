"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("../../api/v1/resources");
/**
 * Route based on the version of the API
 * @param {Application} app
 * @returns {}
 */
exports.default = (app) => {
    app.use("/api/v1/user", resources_1.user);
    app.use("/api/v1/sessions", resources_1.sessions);
};
