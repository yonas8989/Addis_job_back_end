"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsModel = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("./schema");
exports.SessionsModel = (0, mongoose_1.model)("Session", schema_1.sessionsSchema);
