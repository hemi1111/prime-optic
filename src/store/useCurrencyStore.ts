import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrencyCode } from "../services/currencyService";

export type Currency = CurrencyCode;

type CurrencyState = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: Record<Currency, number> | null;
  setRates: (rates: Record<Currency, number> | null) => void;
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "EUR",
      setCurrency: (currency) => set({ currency }),
      rates: null,
      setRates: (rates) => set({ rates }),
    }),
    {
      name: "currency-preference",
      partialize: (state) => ({ currency: state.currency }),
    },
  ),
);
