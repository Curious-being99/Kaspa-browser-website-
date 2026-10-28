import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory cache for USD oracle (refreshed every 30s) to keep 3-5s stream lightning fast
let cachedKasUsd: number | null = null;
let lastKasUsdFetch = 0;

async function getKasUsd(): Promise<number> {
  const now = Date.now();
  if (cachedKasUsd !== null && now - lastKasUsdFetch < 30000) {
    return cachedKasUsd;
  }
  try {
    const res = await fetch('https://kascov.io/data/price.json');
    const data = await res.json();
    cachedKasUsd = Number(data.kas_usd) || 0.0357;
    lastKasUsdFetch = now;
    return cachedKasUsd;
  } catch {
    return cachedKasUsd || 0.0357;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const tokenAddress = 'b75a6e90f569965bdeec23c460ebd59e0f0445d8aa8f5d4330fe15c66a47b4d8';
  const KASCOV_TOKEN_URL = `https://kascov.io/data/mainnet/token/${tokenAddress}.json`;

  // Helper for consistent CORS & zero-cache streaming headers
  const setHeaders = (r: VercelResponse) => {
    r.setHeader('Access-Control-Allow-Origin', '*');
    r.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    r.setHeader('Content-Type', 'application/json');
  };

  try {
    const [tokenRes, kasUsd] = await Promise.all([
      fetch(`${KASCOV_TOKEN_URL}?_t=${Date.now()}`).then(r => {
        if (!r.ok) throw new Error(`Kascov API responded with status ${r.status}`);
        return r.json();
      }),
      getKasUsd()
    ]);

    // Calculate spot price in Sompi directly from on-chain market data
    let spotSompi = 0;
    if (tokenRes.market?.spot_num_sompi && tokenRes.market?.spot_den) {
      spotSompi = tokenRes.market.spot_num_sompi / tokenRes.market.spot_den;
    } else if (tokenRes.trades && tokenRes.trades.length > 0) {
      const latestTrade = tokenRes.trades[0];
      spotSompi = Number(latestTrade.quote_sompi) / Number(latestTrade.base_amount || 1);
    } else {
      spotSompi = 18415.26;
    }

    // KaspaRocket official display conversion: 1 display $KB = 1,000 on-chain base units (RAW_PER_TOKEN = 1000)
    // priceKasPerDisplayUnit = (spotSompi * RAW_PER_TOKEN) / 1e8
    const RAW_PER_TOKEN = 1000;
    const priceNative = (spotSompi * RAW_PER_TOKEN) / 1e8; // KAS per $KB (e.g. ~0.184153 KAS)
    const kbPerKas = priceNative > 0 ? 1 / priceNative : 0; // $KB per 1 KAS (e.g. ~5.43 KB per 1 KAS)
    const priceUsd = priceNative * kasUsd; // USD per $KB (e.g. ~$0.00657)

    // 24h metrics from Kascov
    // change_24h_bps: basis points (-301 bps = -3.01%)
    const priceChange24h = typeof tokenRes.market?.change_24h_bps === 'number'
      ? tokenRes.market.change_24h_bps / 100
      : 0;

    const volume24hKas = typeof tokenRes.market?.volume_24h_sompi === 'number'
      ? tokenRes.market.volume_24h_sompi / 1e8
      : 0;
    const volume24hUsd = volume24hKas * kasUsd;

    const totalSupply = Number(tokenRes.token?.supply) || 1000000000;
    const displaySupply = totalSupply / RAW_PER_TOKEN; // 1,000,000 display KB tokens
    const fdv = displaySupply * priceUsd;

    const responseData = {
      priceUsd: priceUsd.toFixed(8),
      priceNative: priceNative.toFixed(8),
      kbPerKas: Number(kbPerKas.toFixed(2)),
      priceChange24h: Number(priceChange24h.toFixed(2)),
      volume24h: Number(volume24hUsd.toFixed(2)),
      volume24hKas: Number(volume24hKas.toFixed(2)),
      fdv: Number(fdv.toFixed(2)),
      baseToken: {
        name: tokenRes.token?.claimed_name || 'Kaspabrowser',
        symbol: tokenRes.token?.claimed_ticker || 'KB',
        imageUrl: tokenRes.token?.claimed_image || 'https://storage.googleapis.com/kaspa-rocket-prod-uploads/7c70c6f4-faa9-4d84-ba81-62553168f1a9.png'
      },
      source: 'kascov.io',
      success: true,
      timestamp: Date.now()
    };

    setHeaders(res);
    return res.status(200).json(responseData);
  } catch (error: any) {
    console.error('Kascov Token API Error:', error);
    setHeaders(res);
    return res.status(500).json({ error: error.message, success: false });
  }
}
