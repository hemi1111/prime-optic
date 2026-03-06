import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export type CurrencyCode = "EUR" | "USD" | "ALL";

export interface CurrencyRates {
  base: string;
  rates: Record<CurrencyCode, number>;
  updatedAt?: unknown;
}

const SETTINGS_DOC_ID = "currencyRates";
const DEFAULT_RATES: CurrencyRates = {
  base: "EUR",
  rates: { EUR: 1, USD: 1.08, ALL: 104 },
  updatedAt: null,
};

export async function getCurrencyRates(): Promise<CurrencyRates> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  try {
    const ref = doc(db, "settings", SETTINGS_DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return DEFAULT_RATES;
    }
    const data = snap.data() as CurrencyRates;
    return {
      base: data.base ?? DEFAULT_RATES.base,
      rates: { ...DEFAULT_RATES.rates, ...data.rates },
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error("Failed to get currency rates from Firestore:", error);
    return DEFAULT_RATES;
  }
}

export async function setCurrencyRates(
  rates: Record<CurrencyCode, number>,
): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  const ref = doc(db, "settings", SETTINGS_DOC_ID);
  await setDoc(
    ref,
    {
      base: "EUR",
      rates: { ...rates, EUR: 1 },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
