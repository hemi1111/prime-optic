import { useTranslation } from "../hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="font-bold text-slate-700 text-sm">
              {t("footer.shopName")}
            </div>
          </div>
          <div className="text-slate-500 text-sm">{t("footer.tagline")}</div>
        </div>
        <div className="flex flex-wrap gap-6 md:items-center text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            <span>{t("footer.contact")}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{t("footer.phone")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
