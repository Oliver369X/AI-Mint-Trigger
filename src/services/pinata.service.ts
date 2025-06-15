import { PinataSDK } from 'pinata';
import FormData from 'form-data'; // Asegúrate de tener esta librería instalada (npm i form-data)

// LOG para depuración de variables de entorno (puedes quitarlo una vez funcione)
console.log('[PINATA SERVICE LOAD] JWT (inicio):', process.env.PINATA_JWT?.slice(0, 20), '...(fin):', process.env.PINATA_JWT?.slice(-20));
console.log('[PINATA SERVICE LOAD] Gateway:', process.env.PINATA_GATEWAY);

let pinataInstance: PinataSDK | null = null; // Inicialización perezosa

function getPinataInstance(): PinataSDK {
  if (!pinataInstance) {
    if (!process.env.PINATA_JWT || !process.env.PINATA_GATEWAY) {
      throw new Error('PINATA_JWT o PINATA_GATEWAY no están configuradas.');
    }
    pinataInstance = new PinataSDK({
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
export async function uploadFileToPinata(file: Buffer | any) {
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
      const result = await pinata.upload.public.file(fileObj);
      
      console.log('[uploadFileToPinata] Subida exitosa. CID:', result.cid);
      return { cid: result.cid };

    } else {
      // Si no es un Buffer, usar el SDK directamente
      console.log('[uploadFileToPinata] Usando SDK de Pinata para archivo no-Buffer...');
      const pinata = getPinataInstance();
      const result = await pinata.upload.public.file(file);
      console.log('[uploadFileToPinata] Subida exitosa. CID:', result.cid);
      return result;
    }
  } catch (error) {
    console.error('[uploadFileToPinata] Error en la subida a Pinata:', error);
    throw new Error(`Error en la subida a Pinata: ${(error as any).message || error}`);
  }
}

export async function uploadMetadataToPinata(metadata: any) {
  console.log('[uploadMetadataToPinata] Subiendo metadatos a Pinata...');
  try {
    const pinata = getPinataInstance();
    const result = await pinata.upload.public.json(metadata);
    console.log('[uploadMetadataToPinata] Metadatos subidos. CID:', result.cid);
    return result;
  } catch (error) {
    console.error('[uploadMetadataToPinata] Error al subir metadatos:', error);
    throw new Error(`Error al subir metadatos a Pinata: ${(error as any).message || error}`);
  }
} 