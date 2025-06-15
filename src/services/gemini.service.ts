import fetch from 'node-fetch';

export async function getGeminiText(prompt: string, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return response.json();
}

export async function getGeminiImage(prompt: string, apiKey: string, num_images = 1, styles = ["pixel"], models = ["low_poly_world"]) {
  const url = 'https://shopping-online-soporte--flux-api-multi-multimodel-web.modal.run/';
  const body = {
    prompt: prompt,
    api_key: apiKey,
    num_images,
    styles,
    models
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return response.json();
}

export async function getSimpleImage(prompt: string, apiKey: string) {
  const url = 'https://shopping-online-soporte--flux-api-v3-model-web.modal.run';
  const body = {
    prompt: prompt,
    api_key: apiKey
  };
  console.log('[getSimpleImage] Solicitando imagen a Modal/Flux...');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[getSimpleImage] Error de la API de Modal/Flux: ${response.status} - ${errorText}`);
    throw new Error(`Error de la API de Modal/Flux: ${response.status} - ${errorText}`);
  }

  const buffer = await response.buffer();
  console.log('[getSimpleImage] Imagen recibida. Tamaño:', buffer.length, 'bytes');
  return buffer;
} 