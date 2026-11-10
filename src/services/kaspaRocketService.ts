import { KB_TOKEN_CONTRACT } from './tokenService';

export const KASPAROCKET_QUOTE_ENDPOINT = '/api/quote';

export interface KbQuoteResponse {
  success: boolean;
  inputSompi: number;
  inputKas: number;
  outputKbTokens: number;
  rawUnits: string;
  pricePerKbUsd: number;
  exchangeRate: number;
  priceImpact: number;
  feeSompi: number;
}

function finiteNumber(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function fetchKbQuote(amountSompi: number): Promise<KbQuoteResponse | null> {
  if (!Number.isSafeInteger(amountSompi) || amountSompi <= 0) return null;

  try {
    const response = await fetch(KASPAROCKET_QUOTE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ token: KB_TOKEN_CONTRACT, amountSompi, raw: true })
    });
    if (!response.ok || !(response.headers.get('content-type') || '').includes('application/json')) return null;

    const data = await response.json();
    const outputKbTokens = finiteNumber(data?.outputKbTokens ?? data?.amountOut ?? data?.output);
    const pricePerKbUsd = finiteNumber(data?.pricePerKbUsd ?? data?.price);
    const exchangeRate = finiteNumber(data?.exchangeRate ?? data?.rate);
    const priceImpact = finiteNumber(data?.priceImpact);
    const feeSompi = finiteNumber(data?.feeSompi);
    const rawUnits = data?.rawUnits ?? data?.raw;

    if (data?.success === false || outputKbTokens === null || outputKbTokens <= 0 ||
        pricePerKbUsd === null || pricePerKbUsd <= 0 ||
        exchangeRate === null || exchangeRate <= 0 ||
        priceImpact === null || feeSompi === null ||
        (typeof rawUnits !== 'string' && typeof rawUnits !== 'number')) return null;

    return {
      success: true,
      inputSompi: amountSompi,
      inputKas: amountSompi / 1e8,
      outputKbTokens,
      rawUnits: String(rawUnits),
      pricePerKbUsd,
      exchangeRate,
      priceImpact,
      feeSompi
    };
  } catch (error) {
    console.warn('KaspaRocket quote is unavailable:', error);
    return null;
  }
}
