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

export async function fetchKbTokenStats(): Promise<TokenStats | null> {
  try {
    const response = await fetch(`${TOKEN_API_ENDPOINT}?t=${Date.now()}`);

    if (!response.ok) {
      console.error('API responded with error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (!data.success) return null;

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
  } catch (err) {
    console.error('Failed to fetch token stats:', err);
    return null;
  }
}
