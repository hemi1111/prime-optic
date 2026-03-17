export type CurrencyCode = "EUR" | "USD" | "ALL";

export type ExchangeRates = {
  base: "EUR";
  rates: Record<CurrencyCode, number>;
  fetchedAt: number; // epoch ms
};

const CACHE_KEY = "exchange-rates-v1";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

type ApiResponse = {
  result?: string;
  base_code?: string;
  conversion_rates?: Record<string, number>;
  "error-type"?: string;
};

function getApiKey(): string {
  const key = import.meta.env.VITE_EXCHANGE_RATES_API_KEY as string | undefined;
  if (!key) {
    throw new Error("Missing VITE_EXCHANGE_RATES_API_KEY");
  }
  return key;
}

function parseRatesFromApi(json: ApiResponse): ExchangeRates {
  if (json.result !== "success") {
    const msg = json["error-type"] ? ` (${json["error-type"]})` : "";
    throw new Error(`Exchange rate API error${msg}`);
  }

  if (json.base_code !== "EUR") {
    throw new Error(`Unexpected base currency: ${json.base_code ?? "unknown"}`);
  }

  const r = json.conversion_rates ?? {};
  const EUR = r.EUR ?? 1;
  const USD = r.USD;
  const ALL = r.ALL;

  if (typeof USD !== "number" || typeof ALL !== "number") {
    throw new Error("Exchange rate API response missing USD/ALL rates");
  }

  return {
    base: "EUR",
    rates: { EUR, USD, ALL },
    fetchedAt: Date.now(),
  };
}

function readCache(): ExchangeRates | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExchangeRates;
    if (
      !parsed ||
      parsed.base !== "EUR" ||
      typeof parsed.fetchedAt !== "number" ||
      !parsed.rates ||
      typeof parsed.rates.EUR !== "number" ||
      typeof parsed.rates.USD !== "number" ||
      typeof parsed.rates.ALL !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data: ExchangeRates) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage issues (private mode, quota, etc.)
  }
}

export function getCachedExchangeRates(): ExchangeRates | null {
  return readCache();
}

export function isCacheFresh(data: ExchangeRates, now = Date.now()): boolean {
  return now - data.fetchedAt < CACHE_TTL_MS;
}

export async function fetchExchangeRatesEurBase(): Promise<ExchangeRates> {
  const key = getApiKey();
  const url = `https://v6.exchangerate-api.com/v6/${encodeURIComponent(key)}/latest/EUR`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Exchange rate API HTTP ${res.status}`);
  }
  const json = (await res.json()) as ApiResponse;
  const parsed = parseRatesFromApi(json);
  writeCache(parsed);
  return parsed;
}

export async function getExchangeRatesEurBase(options?: {
  preferCache?: boolean;
}): Promise<ExchangeRates> {
  const preferCache = options?.preferCache ?? true;
  const cached = readCache();
  if (preferCache && cached && isCacheFresh(cached)) return cached;
  return await fetchExchangeRatesEurBase();
}

