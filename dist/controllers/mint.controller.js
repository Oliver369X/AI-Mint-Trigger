"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareMintController = prepareMintController;
const gemini_service_1 = require("../services/gemini.service");
const pinata_service_1 = require("../services/pinata.service");
const sdk_1 = require("@sherrylinks/sdk");
const nftMintAbi = [
    {
        name: 'mint',
        type: 'function',
        stateMutability: 'payable',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'collectionId', type: 'uint256' },
            { name: 'uri', type: 'string' },
        ],
        outputs: [],
    },
];
function prepareMintController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prompt, userWallet, collectionId } = req.body;
        const apiKey = process.env.MODAL_API_KEY;
        const contractAddress = process.env.CONTRACT_ADDRESS;
        const mintPrice = parseFloat(process.env.MINT_PRICE || '0.1');
        try {
            console.log('[prepare-mint] Paso 1: Generando imagen con Modal/Flux...');
            const buffer = yield (0, gemini_service_1.getSimpleImage)(prompt, apiKey);
            console.log('[prepare-mint] Imagen generada. Tamaño:', buffer.length, 'bytes');
            console.log('[prepare-mint] Paso 2: Subiendo imagen a Pinata...');
            const uploadImg = yield (0, pinata_service_1.uploadFileToPinata)(buffer);
            console.log('[prepare-mint] Imagen subida a Pinata. CID:', uploadImg.cid);
            const ipfsImageUri = `ipfs://${uploadImg.cid}`;
            console.log('[prepare-mint] Paso 3: Subiendo metadatos a Pinata...');
            const metadata = {
                name: `NFT generado - ${prompt}`,
                description: `Un NFT generado con el prompt: ${prompt}`,
                image: ipfsImageUri,
                attributes: [
                    { trait_type: "Prompt", value: prompt },
                    { trait_type: "Collection ID", value: collectionId }
                ]
            };
            const uploadMeta = yield (0, pinata_service_1.uploadMetadataToPinata)(metadata);
            console.log('[prepare-mint] Metadatos subidos a Pinata. CID:', uploadMeta.cid);
            const tokenUri = `ipfs://${uploadMeta.cid}`;
            console.log('[prepare-mint] Paso 4: Preparando acción de mint para Sherry...');
            const action = {
                type: 'blockchain',
                label: 'Acuñar NFT',
                address: contractAddress,
                abi: nftMintAbi,
                functionName: 'mint',
                chains: { source: 'fuji' },
                amount: mintPrice,
                params: [
                    {
                        name: 'to',
                        label: 'Tu dirección',
                        type: 'address',
                        required: true,
                        value: userWallet,
                        fixed: true,
                    },
                    {
                        name: 'collectionId',
                        label: 'Colección',
                        type: 'number',
                        required: true,
                        value: Number(collectionId),
                        fixed: true,
                    },
                    {
                        name: 'uri',
                        label: 'Metadata URI',
                        type: 'string',
                        value: tokenUri,
                        fixed: true,
                    },
                ],
            };
            console.log('[prepare-mint] Acción de mint preparada:', JSON.stringify(action));
            // Validar con el SDK
            try {
                console.log('[prepare-mint] Paso 5: Validando acción con SDK de Sherry...');
                (0, sdk_1.createMetadata)({
                    url: 'https://minithon.local',
                    icon: '🖼️',
                    title: 'MiniApp Mint NFT',
                    description: 'Acuña tu NFT generado por IA',
                    actions: [action],
                });
                console.log('[prepare-mint] Acción validada correctamente.');
            }
            catch (validationError) {
                console.error('[prepare-mint] Error de validación con SDK de Sherry:', validationError);
                return res.status(500).json({ error: 'Acción inválida para Sherry', details: validationError.message });
            }
            res.status(200).json(action);
        }
        catch (err) {
            console.error('[prepare-mint] Error general en el flujo de mint:', err);
            res.status(500).json({ error: 'Error en el flujo de mint', details: err.message });
        }
    });
}
