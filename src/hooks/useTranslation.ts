import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return { t, language };
}
