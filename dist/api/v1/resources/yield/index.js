"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const shared_1 = require("../../../../shared");
const router = (0, express_1.Router)();
router.use(middleware_1.protect); // All routes protected
// Yield prediction routes
router.post('/predict', (0, middleware_1.auth)(shared_1.Role.User), (0, middleware_1.validator)(validation_1.yieldPredictionValidation), controller_1.createYieldPrediction);
router.get('/history', (0, middleware_1.auth)(shared_1.Role.User), (0, middleware_1.validator)(validation_1.yieldHistoryValidation), controller_1.getYieldHistory);
router.get('/:id', (0, middleware_1.auth)(shared_1.Role.User), controller_1.getYieldPrediction);
exports.default = router;
