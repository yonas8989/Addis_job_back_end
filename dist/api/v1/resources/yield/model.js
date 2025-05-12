"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldModel = void 0;
const schema_1 = require("./schema");
const mongoose_1 = require("mongoose");
exports.YieldModel = (0, mongoose_1.model)("YieldPrediction", schema_1.yieldSchema);
