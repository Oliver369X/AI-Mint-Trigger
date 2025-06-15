import request from 'supertest';
import express from 'express';
import geminiRouter from '../src/routes/gemini.routes';
import { getSimpleImage } from '../src/services/gemini.service';

describe('Endpoints Gemini', () => {
  const app = express();
  app.use(express.json());
  app.use('/', geminiRouter);

  it('POST /gemini-text responde con texto de Gemini', async () => {
    const res = await request(app)
      .post('/gemini-text')
      .send({ prompt: '¿Qué es la inteligencia artificial?' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('candidates');
    expect(res.body.candidates[0]).toHaveProperty('content');
  });

  it('POST /gemini-image responde con un CID/IPFS', async () => {
    // Este test puede fallar si la API de imagen o Pinata no están bien configuradas
    const res = await request(app)
      .post('/gemini-image')
      .send({ prompt: 'Un gato pixel art' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ipfs');
    expect(typeof res.body.ipfs).toBe('string');
  });
});

describe('Función getSimpleImage', () => {
  it('genera una imagen (Buffer) a partir de un prompt', async () => {
    const apiKey = process.env.MODAL_API_KEY;
    if (!apiKey) {
      console.warn('MODAL_API_KEY no configurada, se omite el test de getSimpleImage');
      return;
    }
    const prompt = 'Un dragón azul volando sobre montañas';
    const buffer = await getSimpleImage(prompt, apiKey);
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });
}); 