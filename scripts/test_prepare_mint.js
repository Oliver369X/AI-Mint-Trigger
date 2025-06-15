const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { prepareMintController } = require('../dist/controllers/mint.controller');

// Mock de Request y Response
const mockRequest = {
  body: {
    prompt: "Un gato espacial con un traje de astronauta",
    userWallet: "0x1234567890123456789012345678901234567890",
    collectionId: "1"
  }
};

const mockResponse = {
  status: function(code) {
    console.log(`[Test] Status code: ${code}`);
    return this;
  },
  json: function(data) {
    console.log('[Test] Response data:', JSON.stringify(data, null, 2));
    return this;
  }
};

async function testPrepareMint() {
  console.log('[Test] Iniciando prueba de prepare-mint...');
  console.log('[Test] Prompt:', mockRequest.body.prompt);
  console.log('[Test] Wallet:', mockRequest.body.userWallet);
  console.log('[Test] Collection ID:', mockRequest.body.collectionId);
  
  try {
    await prepareMintController(mockRequest, mockResponse);
  } catch (error) {
    console.error('[Test] Error en la prueba:', error);
  }
}

testPrepareMint(); 