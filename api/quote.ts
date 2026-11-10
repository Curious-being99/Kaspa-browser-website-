import type { VercelRequest, VercelResponse } from '@vercel/node';

const KB_TOKEN_CONTRACT = 'b75a6e90f569965bdeec23c460ebd59e0f0445d8aa8f5d4330fe15c66a47b4d8';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const amountSompi = req.body?.amountSompi;
  if (req.body?.token !== KB_TOKEN_CONTRACT || req.body?.raw !== true ||
      !Number.isSafeInteger(amountSompi) || amountSompi <= 0) {
    return res.status(400).json({ error: 'Invalid quote request' });
  }

  try {
    const response = await fetch('https://kasparocket.fun/pro-api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'KaspaBrowser-Website'
      },
      body: JSON.stringify({ token: KB_TOKEN_CONTRACT, amountSompi, raw: true })
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return res.status(502).json({ error: 'Quote provider returned an invalid response' });
    }

    const data = await response.json();
    if (!response.ok || !data || typeof data !== 'object' || Array.isArray(data)) {
      return res.status(response.status >= 400 ? response.status : 502).json({ error: 'Live quote is unavailable' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('KaspaRocket quote proxy error:', error);
    return res.status(502).json({ error: 'Live quote provider is temporarily unavailable' });
  }
}
