import { useEffect } from "react";
import { getCurrencyRates } from "../services/currencyService";
import { useCurrencyStore } from "../store/useCurrencyStore";

const CurrencyRatesLoader = () => {
  const setRates = useCurrencyStore((s) => s.setRates);

  useEffect(() => {
    getCurrencyRates().then((data) => {
      setRates(data.rates as Record<"EUR" | "USD" | "ALL", number>);
    });
  }, [setRates]);

  return null;
};

export default CurrencyRatesLoader;
