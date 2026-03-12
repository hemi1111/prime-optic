import { useCurrencyStore, type Currency } from "../store/useCurrencyStore";
import { useTranslation } from "../hooks/useTranslation";

const CURRENCIES: Currency[] = ["EUR", "USD", "ALL"];

const CurrencySwitcher = () => {
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value as Currency);
  };

  const labelKey: Record<Currency, string> = {
    EUR: "currency.eur",
    USD: "currency.usd",
    ALL: "currency.all",
  };

  return (
    <div className="relative">
      <select
        value={currency}
        onChange={handleChange}
        className="min-w-[6.5rem] appearance-none rounded-lg border border-slate-200 bg-slate-50/80 pl-3 pr-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-primary-300 hover:bg-white focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        style={{ backgroundImage: "none" }}
        aria-label="Select currency"
      >
        {CURRENCIES.map((code) => (
          <option key={code} value={code}>
            {t(labelKey[code])} ({code})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySwitcher;
