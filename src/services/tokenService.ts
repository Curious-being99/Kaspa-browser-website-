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

function finiteNumber(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchDirectFromKascov(): Promise<TokenStats | null> {
  try {
    const [tokenResponse, priceResponse] = await Promise.all([
      fetch(`https://kascov.io/data/mainnet/token/${KB_TOKEN_CONTRACT}.json`, { cache: 'no-store' }),
      fetch('https://kascov.io/data/price.json', { cache: 'no-store' })
    ]);
    if (!tokenResponse.ok || !priceResponse.ok) return null;

    const [tokenData, priceData] = await Promise.all([tokenResponse.json(), priceResponse.json()]);
    const kasUsd = finiteNumber(priceData?.kas_usd);
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
    if (!kasUsd || kasUsd <= 0 || !Number.isFinite(spotSompi) || spotSompi <= 0 || supply === null || supply <= 0) {
      return null;
    }

    const rawUnitsPerDisplayToken = 1000;
    const priceNative = (spotSompi * rawUnitsPerDisplayToken) / 1e8;
    const priceUsd = priceNative * kasUsd;
    if (!Number.isFinite(priceNative) || priceNative <= 0 || !Number.isFinite(priceUsd) || priceUsd <= 0) return null;

    const changeBps = finiteNumber(tokenData?.market?.change_24h_bps);
    const volumeSompi = finiteNumber(tokenData?.market?.volume_24h_sompi) ?? 0;
    const volume24hKas = volumeSompi / 1e8;
    const displaySupply = supply / rawUnitsPerDisplayToken;

    return {
      priceUsd,
      priceNative,
      kbPerKas: 1 / priceNative,
      priceChange24h: changeBps === null ? 0 : changeBps / 100,
      volume24h: volume24hKas * kasUsd,
      volume24hKas,
      fdv: displaySupply * priceUsd,
      imageUrl: '/logo-square.png',
      name: tokenData.token?.claimed_name || 'Kaspabrowser',
      symbol: tokenData.token?.claimed_ticker || 'KB',
      success: true
    };
  } catch (error) {
    console.warn('Direct Kascov fetch failed:', error);
    return null;
  }
}

export async function fetchKbTokenStats(): Promise<TokenStats | null> {
  try {
    const response = await fetch(`${TOKEN_API_ENDPOINT}?t=${Date.now()}`, { cache: 'no-store' });
    if (response.ok && (response.headers.get('content-type') || '').includes('application/json')) {
      const data = await response.json();
      const priceUsd = finiteNumber(data?.priceUsd);
      const priceNative = finiteNumber(data?.priceNative);
      const kbPerKas = finiteNumber(data?.kbPerKas);
      const priceChange24h = finiteNumber(data?.priceChange24h);
      const volume24h = finiteNumber(data?.volume24h);
      const volume24hKas = finiteNumber(data?.volume24hKas);
      const fdv = finiteNumber(data?.fdv);

      if (data?.success === true && priceUsd !== null && priceUsd > 0 &&
          priceNative !== null && priceNative > 0 && kbPerKas !== null && kbPerKas > 0 &&
          priceChange24h !== null && volume24h !== null && fdv !== null) {
        return {
          priceUsd, priceNative, kbPerKas, priceChange24h, volume24h,
          volume24hKas: volume24hKas ?? undefined,
          fdv,
          imageUrl: typeof data.baseToken?.imageUrl === 'string' ? data.baseToken.imageUrl : '/logo-square.png',
          name: typeof data.baseToken?.name === 'string' ? data.baseToken.name : 'Kaspabrowser',
          symbol: typeof data.baseToken?.symbol === 'string' ? data.baseToken.symbol : 'KB',
          success: true
        };
      }
    }
  } catch (error) {
    console.warn('Server API /api/token unavailable; trying the direct Kascov endpoint:', error);
  }

  return fetchDirectFromKascov();
}
