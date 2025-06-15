import { uploadFileToPinata, uploadMetadataToPinata } from '../src/services/pinata.service';

jest.mock('pinata', () => {
  return {
    PinataSDK: jest.fn().mockImplementation(() => ({
      upload: {
        public: {
          file: jest.fn().mockResolvedValue({ cid: 'QmFakeImageHash' }),
          json: jest.fn().mockResolvedValue({ cid: 'QmFakeMetadataHash' }),
        },
      },
    })),
  };
});

describe('Pinata Service', () => {
  it('sube una imagen a IPFS', async () => {
    const file = { name: 'test.png', type: 'image/png', size: 4 } as any;
    const result = await uploadFileToPinata(file);
    expect(result).toHaveProperty('cid', 'QmFakeImageHash');
  });

  it('sube metadatos a IPFS', async () => {
    const metadata = { name: 'NFT', description: 'desc', image: 'ipfs://fake' };
    const result = await uploadMetadataToPinata(metadata);
    expect(result).toHaveProperty('cid', 'QmFakeMetadataHash');
  });
});

describe('Flujo completo Pinata', () => {
  it('sube imagen y metadatos a IPFS y obtiene ambos CIDs', async () => {
    // Simula un buffer de imagen
    const fakeBuffer = Buffer.from('fakeimage');
    const imgResult = await uploadFileToPinata(fakeBuffer);
    expect(imgResult).toHaveProperty('cid', 'QmFakeImageHash');
    const ipfsImageUri = `ipfs://${imgResult.cid}`;
    const metadata = {
      name: 'NFT de prueba',
      description: 'Un NFT generado para test',
      image: ipfsImageUri,
      attributes: [
        { trait_type: 'Test', value: 'Sí' }
      ]
    };
    const metaResult = await uploadMetadataToPinata(metadata);
    expect(metaResult).toHaveProperty('cid', 'QmFakeMetadataHash');
    const tokenUri = `ipfs://${metaResult.cid}`;
    expect(typeof tokenUri).toBe('string');
    expect(tokenUri.startsWith('ipfs://')).toBe(true);
  });
}); 