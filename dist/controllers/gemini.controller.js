"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiTextController = geminiTextController;
exports.geminiImageController = geminiImageController;
const gemini_service_1 = require("../services/gemini.service");
const pinata_service_1 = require("../services/pinata.service");
function geminiTextController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        try {
            const data = yield (0, gemini_service_1.getGeminiText)(prompt, apiKey);
            res.json(data);
        }
        catch (err) {
            res.status(500).json({ error: 'Error al consumir Gemini' });
        }
    });
}
function geminiImageController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        try {
            const data = yield (0, gemini_service_1.getGeminiImage)(prompt, apiKey);
            const image_base64 = data.images[0].image_base64;
            const buffer = Buffer.from(image_base64, 'base64');
            // Subir el buffer directamente a Pinata (Buffer o File)
            const upload = yield (0, pinata_service_1.uploadFileToPinata)(buffer);
            res.json({ ipfs: upload.cid });
        }
        catch (err) {
            res.status(500).json({ error: 'Error al generar imagen o subir a Pinata' });
        }
    });
}
