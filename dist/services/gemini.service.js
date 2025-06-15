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
exports.getGeminiText = getGeminiText;
exports.getGeminiImage = getGeminiImage;
exports.getSimpleImage = getSimpleImage;
const node_fetch_1 = __importDefault(require("node-fetch"));
function getGeminiText(prompt, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const body = {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        };
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return response.json();
    });
}
function getGeminiImage(prompt_1, apiKey_1) {
    return __awaiter(this, arguments, void 0, function* (prompt, apiKey, num_images = 1, styles = ["pixel"], models = ["low_poly_world"]) {
        const url = 'https://shopping-online-soporte--flux-api-multi-multimodel-web.modal.run/';
        const body = {
            prompt: prompt,
            api_key: apiKey,
            num_images,
            styles,
            models
        };
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return response.json();
    });
}
function getSimpleImage(prompt, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://shopping-online-soporte--flux-api-v3-model-web.modal.run';
        const body = {
            prompt: prompt,
            api_key: apiKey
        };
        console.log('[getSimpleImage] Solicitando imagen a Modal/Flux...');
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorText = yield response.text();
            console.error(`[getSimpleImage] Error de la API de Modal/Flux: ${response.status} - ${errorText}`);
            throw new Error(`Error de la API de Modal/Flux: ${response.status} - ${errorText}`);
        }
        const buffer = yield response.buffer();
        console.log('[getSimpleImage] Imagen recibida. Tamaño:', buffer.length, 'bytes');
        return buffer;
    });
}
