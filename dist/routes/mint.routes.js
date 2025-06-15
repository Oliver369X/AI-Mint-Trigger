"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mint_controller_1 = require("../controllers/mint.controller");
const router = express_1.default.Router();
router.post('/prepare-mint', mint_controller_1.prepareMintController);
exports.default = router;
