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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToPinata = uploadFileToPinata;
exports.uploadMetadataToPinata = uploadMetadataToPinata;
const pinata_1 = require("pinata");
// LOG para depuración de variables de entorno (puedes quitarlo una vez funcione)
console.log('[PINATA SERVICE LOAD] JWT (inicio):', (_a = process.env.PINATA_JWT) === null || _a === void 0 ? void 0 : _a.slice(0, 20), '...(fin):', (_b = process.env.PINATA_JWT) === null || _b === void 0 ? void 0 : _b.slice(-20));
console.log('[PINATA SERVICE LOAD] Gateway:', process.env.PINATA_GATEWAY);
let pinataInstance = null; // Inicialización perezosa
function getPinataInstance() {
    if (!pinataInstance) {
        if (!process.env.PINATA_JWT || !process.env.PINATA_GATEWAY) {
            throw new Error('PINATA_JWT o PINATA_GATEWAY no están configuradas.');
        }
        pinataInstance = new pinata_1.PinataSDK({
            pinataJwt: process.env.PINATA_JWT,
            pinataGateway: process.env.PINATA_GATEWAY
        });
    }
    return pinataInstance;
}
/**
 * Sube un archivo a Pinata. Puede ser un Buffer (imagen) o un objeto File-like.
 * Para Buffers en Node.js, se usa FormData explícitamente para mayor control.
 */
function uploadFileToPinata(file) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('[uploadFileToPinata] Intentando subir archivo a Pinata...');
        try {
            const jwt = process.env.PINATA_JWT;
            if (!jwt) {
                throw new Error('PINATA_JWT no está configurada.');
            }
            if (Buffer.isBuffer(file)) {
                console.log('[uploadFileToPinata] Archivo es un Buffer. Construyendo FormData...');
                // Crear un Blob a partir del Buffer
                const blob = new Blob([file], { type: 'image/jpeg' });
                // Crear un File a partir del Blob
                const fileObj = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                // Usar el SDK de Pinata directamente
                const pinata = getPinataInstance();
                console.log('[uploadFileToPinata] Subiendo archivo usando SDK de Pinata...');
                const result = yield pinata.upload.public.file(fileObj);
                console.log('[uploadFileToPinata] Subida exitosa. CID:', result.cid);
                return { cid: result.cid };
            }
            else {
                // Si no es un Buffer, usar el SDK directamente
                console.log('[uploadFileToPinata] Usando SDK de Pinata para archivo no-Buffer...');
                const pinata = getPinataInstance();
                const result = yield pinata.upload.public.file(file);
                console.log('[uploadFileToPinata] Subida exitosa. CID:', result.cid);
                return result;
            }
        }
        catch (error) {
            console.error('[uploadFileToPinata] Error en la subida a Pinata:', error);
            throw new Error(`Error en la subida a Pinata: ${error.message || error}`);
        }
    });
}
function uploadMetadataToPinata(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('[uploadMetadataToPinata] Subiendo metadatos a Pinata...');
        try {
            const pinata = getPinataInstance();
            const result = yield pinata.upload.public.json(metadata);
            console.log('[uploadMetadataToPinata] Metadatos subidos. CID:', result.cid);
            return result;
        }
        catch (error) {
            console.error('[uploadMetadataToPinata] Error al subir metadatos:', error);
            throw new Error(`Error al subir metadatos a Pinata: ${error.message || error}`);
        }
    });
}
