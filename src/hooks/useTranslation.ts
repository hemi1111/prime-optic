import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);

  const t = (key: string, params?: Record<string, string>): string => {
    let value = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
      });
    }
    return value;
  };

  return { t, language };
}
