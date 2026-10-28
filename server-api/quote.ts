import type { VercelRequest, VercelResponse } from '@vercel/node';
import { KaspaRocket } from '@kasparocket/sdk';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize KaspaRocket SDK client for swap quoting
    const rocket = new KaspaRocket();

    const response = await fetch('https://kasparocket.fun/pro-api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'KaspaBrowser-Website'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    data.sdkPowered = true;
    
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error('KaspaRocket SDK Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
