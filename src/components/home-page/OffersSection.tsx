import { Link } from "react-router-dom";

import { useTranslation } from "../../hooks/useTranslation";

const OffersSection = () => {
  const { t } = useTranslation();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {t("home.offers.title")}
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Link
          to="/glasses"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-medium hover:ring-primary-200"
        >
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-primary-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative space-y-3">
            <div className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-700">
              {t("home.offers.promotion.title")}
            </div>
            <div className="text-lg font-bold text-slate-900">
              {t("home.offers.promotion.heading")}
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {t("home.offers.promotion.description")}
            </p>
          </div>
          <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
            {t("home.offers.promotion.cta")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/glasses"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-medium hover:ring-primary-200"
        >
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-accent-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative space-y-3">
            <div className="inline-flex rounded-full bg-accent-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-700">
              {t("home.offers.kids.title")}
            </div>
            <div className="text-lg font-bold text-slate-900">
              {t("home.offers.kids.heading")}
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {t("home.offers.kids.description")}
            </p>
          </div>
          <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
            {t("home.offers.kids.cta")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/glasses"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-slate-900 p-6 text-slate-50 shadow-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-strong"
        >
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative space-y-3">
            <div className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-100 backdrop-blur-sm">
              {t("home.offers.blueLight.title")}
            </div>
            <div className="text-lg font-bold">
              {t("home.offers.blueLight.heading")}
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {t("home.offers.blueLight.description")}
            </p>
          </div>
          <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-white transition-colors group-hover:text-slate-100">
            {t("home.offers.blueLight.cta")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default OffersSection;
