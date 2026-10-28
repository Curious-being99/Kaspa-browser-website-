export const KB_TOKEN_CONTRACT = 'b75a6e90f569965bdeec23c460ebd59e0f0445d8aa8f5d4330fe15c66a47b4d8';
const TOKEN_API_ENDPOINT = '/api/token';

export interface TokenStats {
  priceUsd: number;
  priceNative: number;
  kbPerKas: number;
  priceChange24h: number;
  volume24h: number;
  volume24hKas?: number;
  fdv: number;
  imageUrl: string;
  name: string;
  symbol: string;
  success: boolean;
}

async function fetchDirectFromKascov(): Promise<TokenStats | null> {
  try {
    const [tokenRes, priceRes] = await Promise.all([
      fetch(`https://kascov.io/data/mainnet/token/${KB_TOKEN_CONTRACT}.json?_t=${Date.now()}`).then(r => r.json()),
      fetch('https://kascov.io/data/price.json').then(r => r.json()).catch(() => ({ kas_usd: 0.0357 }))
    ]);

    const kasUsd = Number(priceRes.kas_usd) || 0.0357;
    let spotSompi = 0;
    if (tokenRes.market?.spot_num_sompi && tokenRes.market?.spot_den) {
      spotSompi = tokenRes.market.spot_num_sompi / tokenRes.market.spot_den;
    } else if (tokenRes.trades && tokenRes.trades.length > 0) {
      const latestTrade = tokenRes.trades[0];
      spotSompi = Number(latestTrade.quote_sompi) / Number(latestTrade.base_amount || 1);
    } else {
      spotSompi = 18415.26;
    }

    const RAW_PER_TOKEN = 1000;
    const priceNative = (spotSompi * RAW_PER_TOKEN) / 1e8;
    const kbPerKas = priceNative > 0 ? 1 / priceNative : 0;
    const priceUsd = priceNative * kasUsd;

    const priceChange24h = typeof tokenRes.market?.change_24h_bps === 'number'
      ? tokenRes.market.change_24h_bps / 100
      : 0;

    const volume24hKas = typeof tokenRes.market?.volume_24h_sompi === 'number'
      ? tokenRes.market.volume_24h_sompi / 1e8
      : 0;
    const volume24hUsd = volume24hKas * kasUsd;

    const totalSupply = Number(tokenRes.token?.supply) || 1000000000;
    const displaySupply = totalSupply / RAW_PER_TOKEN;
    const fdv = displaySupply * priceUsd;

    return {
      priceUsd,
      priceNative,
      kbPerKas: Number(kbPerKas.toFixed(2)),
      priceChange24h: Number(priceChange24h.toFixed(2)),
      volume24h: Number(volume24hUsd.toFixed(2)),
      volume24hKas: Number(volume24hKas.toFixed(2)),
      fdv: Number(fdv.toFixed(2)),
      imageUrl: tokenRes.token?.claimed_image || 'https://storage.googleapis.com/kaspa-rocket-prod-uploads/7c70c6f4-faa9-4d84-ba81-62553168f1a9.png',
      name: tokenRes.token?.claimed_name || 'Kaspabrowser',
      symbol: tokenRes.token?.claimed_ticker || 'KB',
      success: true
    };
  } catch (err) {
    console.error('Direct Kascov fetch failed:', err);
    return null;
  }
}

export async function fetchKbTokenStats(): Promise<TokenStats | null> {
  try {
    const response = await fetch(`${TOKEN_API_ENDPOINT}?t=${Date.now()}`);

    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.success) {
          const priceNative = parseFloat(data.priceNative) || 0;
          const kbPerKas = data.kbPerKas || (priceNative > 0 ? 1 / priceNative : 0);

          return {
            priceUsd: parseFloat(data.priceUsd) || 0,
            priceNative,
            kbPerKas,
            priceChange24h: data.priceChange24h || 0,
            volume24h: data.volume24h || 0,
            volume24hKas: data.volume24hKas || 0,
            fdv: data.fdv || 0,
            imageUrl: data.baseToken?.imageUrl || '',
            name: data.baseToken?.name || 'Kaspabrowser',
            symbol: data.baseToken?.symbol || 'KB',
            success: true
          };
        }
      }
    }
  } catch (err) {
    console.warn('Server API /api/token unreachable, using direct on-chain browser fallback:', err);
  }

  // Resilient Fallback directly to Kascov node on-chain feed
  return fetchDirectFromKascov();
}
