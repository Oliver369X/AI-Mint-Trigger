"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gemini_controller_1 = require("../controllers/gemini.controller");
const router = express_1.default.Router();
router.post('/gemini-text', gemini_controller_1.geminiTextController);
router.post('/gemini-image', gemini_controller_1.geminiImageController);
exports.default = router;
