import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { PinataSDK } from 'pinata';
dotenv.config();

const router = express.Router();

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY!
});

// Endpoint para texto Gemini
router.post('/gemini-text', async (req, res) => {
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
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al consumir Gemini' });
  }
});

// Endpoint para imagen Gemini + Pinata
router.post('/gemini-image', async (req, res) => {
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
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    const image_base64 = data.images[0].image_base64;
    const buffer = Buffer.from(image_base64, 'base64');
    // Subir el buffer directamente a Pinata (Buffer o File)
    const upload = await pinata.upload.public.file(buffer as any);
    res.json({ ipfs: upload.cid });
  } catch (err) {
    res.status(500).json({ error: 'Error al generar imagen o subir a Pinata' });
  }
});

export default router; 