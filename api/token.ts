import type { VercelRequest, VercelResponse } from '@vercel/node';

const TOKEN_ADDRESS = 'b75a6e90f569965bdeec23c460ebd59e0f0445d8aa8f5d4330fe15c66a47b4d8';
let cachedKasUsd: number | null = null;
let lastKasUsdFetch = 0;

async function getKasUsd(): Promise<number | null> {
  if (cachedKasUsd !== null && Date.now() - lastKasUsdFetch < 30000) return cachedKasUsd;
  try {
    const response = await fetch('https://kascov.io/data/price.json', { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    const value = Number(data?.kas_usd);
    if (!Number.isFinite(value) || value <= 0) return null;
    cachedKasUsd = value;
    lastKasUsdFetch = Date.now();
    return value;
  } catch {
    return null;
  }
}

function finiteNumber(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const [tokenResponse, kasUsd] = await Promise.all([
      fetch(`https://kascov.io/data/mainnet/token/${TOKEN_ADDRESS}.json`, { cache: 'no-store' }),
      getKasUsd()
    ]);
    if (!tokenResponse.ok || kasUsd === null) {
      return res.status(503).json({ success: false, error: 'Live token market data is temporarily unavailable' });
    }

    const tokenData = await tokenResponse.json();
    const numerator = finiteNumber(tokenData?.market?.spot_num_sompi);
    const denominator = finiteNumber(tokenData?.market?.spot_den);
    let spotSompi = numerator !== null && denominator !== null && denominator > 0
      ? numerator / denominator
      : 0;

    if (!(spotSompi > 0) && Array.isArray(tokenData?.trades) && tokenData.trades.length > 0) {
      const trade = tokenData.trades[0];
      const quoteSompi = finiteNumber(trade?.quote_sompi);
      const baseAmount = finiteNumber(trade?.base_amount);
      if (quoteSompi !== null && baseAmount !== null && baseAmount > 0) {
        spotSompi = quoteSompi / baseAmount;
      }
    }

    const supply = finiteNumber(tokenData?.token?.supply);
    if (!Number.isFinite(spotSompi) || spotSompi <= 0 || supply === null || supply <= 0) {
      return res.status(503).json({ success: false, error: 'Live token market data is incomplete' });
    }

    const rawUnitsPerDisplayToken = 1000;
    const priceNative = (spotSompi * rawUnitsPerDisplayToken) / 1e8;
    const priceUsd = priceNative * kasUsd;
    if (!Number.isFinite(priceNative) || priceNative <= 0 || !Number.isFinite(priceUsd) || priceUsd <= 0) {
      return res.status(503).json({ success: false, error: 'Live token price is invalid' });
    }

    const changeBps = finiteNumber(tokenData?.market?.change_24h_bps);
    const volumeSompi = finiteNumber(tokenData?.market?.volume_24h_sompi) ?? 0;
    const volume24hKas = volumeSompi / 1e8;
    const displaySupply = supply / rawUnitsPerDisplayToken;

    return res.status(200).json({
      priceUsd,
      priceNative,
      kbPerKas: 1 / priceNative,
      priceChange24h: changeBps === null ? 0 : changeBps / 100,
      volume24h: volume24hKas * kasUsd,
      volume24hKas,
      fdv: displaySupply * priceUsd,
      baseToken: {
        name: tokenData.token?.claimed_name || 'Kaspabrowser',
        symbol: tokenData.token?.claimed_ticker || 'KB',
        imageUrl: '/logo-square.png'
      },
      source: 'kascov.io',
      success: true,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Kascov Token API Error:', error);
    return res.status(503).json({ success: false, error: 'Live token market data is temporarily unavailable' });
  }
}
