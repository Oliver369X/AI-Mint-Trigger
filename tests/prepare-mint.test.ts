import request from 'supertest';
import express from 'express';
import mintRouter from '../src/routes/mint.routes';

jest.mock('../src/services/gemini.service', () => ({
  getSimpleImage: jest.fn().mockResolvedValue(Buffer.from('fakeimage')),
}));

jest.mock('../src/services/pinata.service', () => ({
  uploadFileToPinata: jest.fn().mockResolvedValue({ cid: 'QmFakeImageHash' }),
  uploadMetadataToPinata: jest.fn().mockResolvedValue({ cid: 'QmFakeMetadataHash' }),
}));

describe('POST /prepare-mint', () => {
  const app = express();
  app.use(express.json());
  app.use('/', mintRouter);

  beforeAll(() => {
    process.env.CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
    process.env.MINT_PRICE = '0.1';
  });

  it('devuelve la acción de mint lista para Sherry', async () => {
    const res = await request(app)
      .post('/prepare-mint')
      .send({ prompt: 'un gato azul', userWallet: '0x1234567890123456789012345678901234567890', collectionId: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('type', 'blockchain');
    expect(res.body).toHaveProperty('params');
    expect(res.body.params[0]).toHaveProperty('name', 'to');
    expect(res.body.params[0].value).toBe('0x1234567890123456789012345678901234567890');
    expect(res.body.params[1]).toHaveProperty('name', 'collectionId');
    expect(res.body.params[1].value).toBe(1);
    expect(res.body.params[2]).toHaveProperty('name', 'uri');
    expect(res.body.params[2].value).toBe('ipfs://QmFakeMetadataHash');
  });
}); 