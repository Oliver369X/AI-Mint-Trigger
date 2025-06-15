import { Request, Response } from 'express';
import { getSimpleImage } from '../services/gemini.service';
import { uploadFileToPinata, uploadMetadataToPinata } from '../services/pinata.service';
import { createMetadata } from '@sherrylinks/sdk';

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
] as const;

export async function prepareMintController(req: Request, res: Response) {
  const { prompt, userWallet, collectionId } = req.body;
  const apiKey = process.env.MODAL_API_KEY!;
  const contractAddress = process.env.CONTRACT_ADDRESS!;
  const mintPrice = parseFloat(process.env.MINT_PRICE || '0.1');
  try {
    console.log('[prepare-mint] Paso 1: Generando imagen con Modal/Flux...');
    const buffer = await getSimpleImage(prompt, apiKey);
    console.log('[prepare-mint] Imagen generada. Tamaño:', buffer.length, 'bytes');

    console.log('[prepare-mint] Paso 2: Subiendo imagen a Pinata...');
    const uploadImg = await uploadFileToPinata(buffer);
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
    const uploadMeta = await uploadMetadataToPinata(metadata);
    console.log('[prepare-mint] Metadatos subidos a Pinata. CID:', uploadMeta.cid);
    const tokenUri = `ipfs://${uploadMeta.cid}`;

    console.log('[prepare-mint] Paso 4: Preparando acción de mint para Sherry...');
    const action = {
      type: 'blockchain' as const,
      label: 'Acuñar NFT',
      address: contractAddress as `0x${string}`,
      abi: nftMintAbi,
      functionName: 'mint',
      chains: { source: 'fuji' as const },
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
      ] as any,
    };
    console.log('[prepare-mint] Acción de mint preparada:', JSON.stringify(action));

    // Validar con el SDK
    try {
      console.log('[prepare-mint] Paso 5: Validando acción con SDK de Sherry...');
      createMetadata({
        url: 'https://minithon.local',
        icon: '🖼️',
        title: 'MiniApp Mint NFT',
        description: 'Acuña tu NFT generado por IA',
        actions: [action],
      });
      console.log('[prepare-mint] Acción validada correctamente.');
    } catch (validationError) {
      console.error('[prepare-mint] Error de validación con SDK de Sherry:', validationError);
      return res.status(500).json({ error: 'Acción inválida para Sherry', details: (validationError as any).message });
    }

    res.status(200).json(action);
  } catch (err) {
    console.error('[prepare-mint] Error general en el flujo de mint:', err);
    res.status(500).json({ error: 'Error en el flujo de mint', details: (err as any).message });
  }
} 