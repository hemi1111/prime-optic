import { useLanguageStore, type Language } from "../store/useLanguageStore";
import { US } from "country-flag-icons/react/3x2";
import { IT } from "country-flag-icons/react/3x2";
import { AL } from "country-flag-icons/react/3x2";

const LanguageSwitcher = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLanguage(event.target.value as Language);
  };

  const languages = [
    { value: "en", label: "English", flag: US },
    { value: "it", label: "Italiano", flag: IT },
    { value: "sq", label: "Shqip", flag: AL },
  ];

  const currentLanguage = languages.find((lang) => lang.value === language);
  const CurrentFlag = currentLanguage?.flag;

  return (
    <div className="relative">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="min-w-[7rem] appearance-none rounded-lg border border-slate-200 bg-slate-50/80 pl-8 pr-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-primary-300 hover:bg-white focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        style={{ backgroundImage: "none" }}
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        {CurrentFlag && <CurrentFlag className="h-4 w-5 rounded-sm shadow-sm" />}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
