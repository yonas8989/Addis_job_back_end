"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const schema_1 = require("./schema");
const mongoose_1 = require("mongoose");
exports.UserModel = (0, mongoose_1.model)("User", schema_1.userSchema);
