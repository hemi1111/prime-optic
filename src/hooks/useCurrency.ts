import { useCurrencyStore, type Currency } from "../store/useCurrencyStore";

/**
 * Formats an amount stored in EUR to the user's selected currency using backend rates.
 */
export function useCurrency() {
  const currency = useCurrencyStore((s) => s.currency);
  const rates = useCurrencyStore((s) => s.rates);

  const formatPrice = (
    amountEur: number,
    options?: { currencyOverride?: Currency; compact?: boolean },
  ): string => {
    const targetCurrency = options?.currencyOverride ?? currency;
    const rate = rates?.[targetCurrency] ?? 1;
    const amount = amountEur * rate;

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: targetCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...(options?.compact && { notation: "compact", maximumFractionDigits: 0 }),
    }).format(Math.round(amount));
  };

  return { formatPrice, currency, rates };
}
