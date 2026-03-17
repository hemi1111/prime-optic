import { useEffect } from "react";
import {
  getCachedExchangeRates,
  fetchExchangeRatesEurBase,
} from "../services/exchangeRatesService";
import { useCurrencyStore } from "../store/useCurrencyStore";

const CurrencyRatesLoader = () => {
  const setRates = useCurrencyStore((s) => s.setRates);

  useEffect(() => {
    let cancelled = false;

    const cached = getCachedExchangeRates();
    if (cached?.rates && !cancelled) {
      setRates(cached.rates);
    }

    // Always refresh once on app initialization (cache is used only for instant UI).
    fetchExchangeRatesEurBase()
      .then((data) => {
        if (!cancelled) setRates(data.rates);
      })
      .catch((error) => {
        console.error("Failed to fetch exchange rates:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [setRates]);

  return null;
};

export default CurrencyRatesLoader;
