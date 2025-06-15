"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const gemini_routes_1 = __importDefault(require("./routes/gemini.routes"));
const mint_routes_1 = __importDefault(require("./routes/mint.routes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
// LOG de variables de entorno importantes
console.log('--- VARIABLES DE ENTORNO ---');
console.log('PINATA_JWT:', process.env.PINATA_JWT ? '[OK]' : '[NO CARGADA]');
console.log('PINATA_GATEWAY:', process.env.PINATA_GATEWAY || '[NO CARGADA]');
console.log('MODAL_API_KEY:', process.env.MODAL_API_KEY ? '[OK]' : '[NO CARGADA]');
console.log('CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS || '[NO CARGADA]');
console.log('----------------------------');
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Sirve los archivos estáticos del frontend (después de que se compile)
// Asume que la carpeta 'dist' del frontend está en '../../frontend/dist' relativo a este archivo compilado.
app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/dist')));
app.use('/', gemini_routes_1.default);
app.use('/', mint_routes_1.default);
// Para cualquier otra ruta que no sea manejada por el backend, sirve el index.html del frontend.
// Esto es crucial para aplicaciones SPA (Single Page Applications) como React.
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../frontend/dist', 'index.html'));
});
app.listen(port, () => {
    console.log(`Backend y Frontend de Sherry escuchando en http://localhost:${port}`);
});
