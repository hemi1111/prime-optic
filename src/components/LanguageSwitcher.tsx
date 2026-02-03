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
        className="appearance-none rounded-full border border-slate-200 bg-white pl-8 pr-8 py-1 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-primary-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
        {CurrentFlag && <CurrentFlag className="h-3 w-4 rounded-sm" />}
      </div>
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

export default LanguageSwitcher;
