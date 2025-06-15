import { Request, Response } from 'express';
import { getGeminiText, getGeminiImage } from '../services/gemini.service';
import { uploadFileToPinata } from '../services/pinata.service';

export async function geminiTextController(req: Request, res: Response) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY!;
  try {
    const data = await getGeminiText(prompt, apiKey);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al consumir Gemini' });
  }
}

export async function geminiImageController(req: Request, res: Response) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY!;
  try {
    const data = await getGeminiImage(prompt, apiKey) as any;
    const image_base64 = data.images[0].image_base64;
    const buffer = Buffer.from(image_base64, 'base64');
    // Subir el buffer directamente a Pinata (Buffer o File)
    const upload = await uploadFileToPinata(buffer);
    res.json({ ipfs: upload.cid });
  } catch (err) {
    res.status(500).json({ error: 'Error al generar imagen o subir a Pinata' });
  }
} 