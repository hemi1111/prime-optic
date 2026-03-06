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
        className="appearance-none rounded-full border border-slate-200 bg-white pl-3 pr-8 py-1 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-primary-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        aria-label="Select currency"
      >
        {CURRENCIES.map((code) => (
          <option key={code} value={code}>
            {t(labelKey[code])} ({code})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg
          className="h-3 w-3 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default CurrencySwitcher;
