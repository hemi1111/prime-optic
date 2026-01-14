import { useLanguageStore, type Language } from "../store/useLanguageStore";

const LanguageSwitcher = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          language === "en"
            ? "bg-primary-500 text-white"
            : "text-slate-600 hover:text-primary-600"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleLanguageChange("sq")}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          language === "sq"
            ? "bg-primary-500 text-white"
            : "text-slate-600 hover:text-primary-600"
        }`}
        aria-label="Switch to Albanian"
      >
        SQ
      </button>
    </div>
  );
};

export default LanguageSwitcher;
