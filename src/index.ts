import express from 'express';
import dotenv from 'dotenv';
import geminiRouter from './routes/gemini.routes';
import mintRouter from './routes/mint.routes';
import path from 'path';

dotenv.config();

// LOG de variables de entorno importantes
console.log('--- VARIABLES DE ENTORNO ---');
console.log('PINATA_JWT:', process.env.PINATA_JWT ? '[OK]' : '[NO CARGADA]');
console.log('PINATA_GATEWAY:', process.env.PINATA_GATEWAY || '[NO CARGADA]');
console.log('MODAL_API_KEY:', process.env.MODAL_API_KEY ? '[OK]' : '[NO CARGADA]');
console.log('CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS || '[NO CARGADA]');
console.log('----------------------------');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Sirve los archivos estáticos del frontend (después de que se compile)
// Asume que la carpeta 'dist' del frontend está en '../../frontend/dist' relativo a este archivo compilado.
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/', geminiRouter);
app.use('/', mintRouter);

// Para cualquier otra ruta que no sea manejada por el backend, sirve el index.html del frontend.
// Esto es crucial para aplicaciones SPA (Single Page Applications) como React.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend y Frontend de Sherry escuchando en http://localhost:${port}`);
}); 