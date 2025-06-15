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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
const pinata_1 = require("pinata");
dotenv_1.default.config();
const router = express_1.default.Router();
const pinata = new pinata_1.PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.PINATA_GATEWAY
});
// Endpoint para texto Gemini
router.post('/gemini-text', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const body = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ]
    };
    try {
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = yield response.json();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: 'Error al consumir Gemini' });
    }
}));
// Endpoint para imagen Gemini + Pinata
router.post('/gemini-image', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    // Aquí debes poner la URL y el body de la API de imagen que ya mostraste
    // Por ejemplo:
    const url = 'https://shopping-online-soporte--flux-api-multi-multimodel-web.modal.run/';
    const body = {
        prompt: prompt,
        api_key: apiKey,
        num_images: 1,
        styles: ["pixel"],
        models: ["low_poly_world"]
    };
    try {
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = yield response.json();
        const image_base64 = data.images[0].image_base64;
        const buffer = Buffer.from(image_base64, 'base64');
        // Subir el buffer directamente a Pinata (Buffer o File)
        const upload = yield pinata.upload.public.file(buffer);
        res.json({ ipfs: upload.cid });
    }
    catch (err) {
        res.status(500).json({ error: 'Error al generar imagen o subir a Pinata' });
    }
}));
exports.default = router;
