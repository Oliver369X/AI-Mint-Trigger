const path = require('path');
const jpeg = require('jpeg-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { uploadFileToPinata } = require('../dist/services/pinata.service');

async function testPinataUpload() {
  // Crear una imagen JPEG simple de 150x150 píxeles
  const width = 150;
  const height = 150;
  const frameData = Buffer.alloc(width * height * 4); // RGBA

  // Rellenar con un color rojo
  for (let i = 0; i < frameData.length; i += 4) {
    frameData[i] = 255;     // R
    frameData[i + 1] = 0;   // G
    frameData[i + 2] = 0;   // B
    frameData[i + 3] = 255; // A
  }

  const rawImageData = {
    data: frameData,
    width: width,
    height: height
  };

  const jpegImageData = jpeg.encode(rawImageData, 90);
  console.log(`[Test Script] Imagen JPEG generada. Tamaño: ${jpegImageData.data.length} bytes`);

  try {
    console.log(`[Test Script] Intentando subir buffer a Pinata. Tamaño: ${jpegImageData.data.length} bytes`);
    const result = await uploadFileToPinata(jpegImageData.data);
    console.log('[Test Script] Subida exitosa a Pinata:', result);
  } catch (error) {
    console.error('[Test Script] Error durante la subida a Pinata:', error);
  }
}

testPinataUpload(); 