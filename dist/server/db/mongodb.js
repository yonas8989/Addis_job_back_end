"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
/**
 * Connect to MongoDB
 * @param {}
 * @returns {}
 */
exports.default = () => {
    mongoose_1.default.connect(config_1.default.db.remote).then(() => {
        console.log(`MongoDB is successfully connected`);
    });
    return mongoose_1.default.connection;
};
