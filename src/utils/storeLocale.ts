import type { Language } from "../store/useLanguageStore";
import type { StoreLocation } from "../data/storeLocations";

export function getLocalizedStoreField(
  store: StoreLocation,
  lang: Language,
  field: "name" | "address" | "hours",
): string {
  const localized = store.i18n?.[lang]?.[field];
  if (localized !== undefined && localized !== "") return localized;
  return store[field];
}
