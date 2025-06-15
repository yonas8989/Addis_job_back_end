"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const shared_1 = require("../../../../shared");
const multer_1 = __importDefault(require("multer"));
// Configure multer for file uploads
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
router.use(middleware_1.protect); // All routes protected
// Yield prediction routes
router.post('/predict', (0, middleware_1.auth)(shared_1.Role.User), (0, middleware_1.validator)(validation_1.yieldPredictionValidation), controller_1.createYieldPrediction);
router.post('/upload', (0, middleware_1.auth)(shared_1.Role.User), upload.single('file'), // Handle single file upload
controller_1.uploadYieldData);
router.get('/history', (0, middleware_1.auth)(shared_1.Role.User), (0, middleware_1.validator)(validation_1.yieldHistoryValidation), controller_1.getYieldHistory);
router.get('/:id', (0, middleware_1.auth)(shared_1.Role.User), controller_1.getYieldPrediction);
exports.default = router;
