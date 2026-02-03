import { Link } from "react-router-dom";

import { useTranslation } from "../../hooks/useTranslation";

const CategoriesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        {t("home.categories.title")}
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        <Link
          to="/glasses"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-medium hover:ring-primary-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-primary-600">
              {t("home.categories.glasses.title")}
            </div>
            <div className="text-lg font-bold text-slate-900">
              {t("home.categories.glasses.heading")}
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {t("home.categories.glasses.description")}
            </p>
          </div>
          <div className="relative mt-6 flex items-center gap-2 text-xs font-semibold text-primary-600 transition-all group-hover:gap-3">
            {t("home.categories.glasses.cta")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/sunglasses"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-medium hover:ring-primary-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-50/0 to-accent-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-primary-600">
              {t("home.categories.sunglasses.title")}
            </div>
            <div className="text-lg font-bold text-slate-900">
              {t("home.categories.sunglasses.heading")}
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {t("home.categories.sunglasses.description")}
            </p>
          </div>
          <div className="relative mt-6 flex items-center gap-2 text-xs font-semibold text-primary-600 transition-all group-hover:gap-3">
            {t("home.categories.sunglasses.cta")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/exam"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-slate-100 shadow-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-strong"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-primary-200">
              {t("home.categories.eyeCare.title")}
            </div>
            <div className="text-lg font-bold">
              {t("home.categories.eyeCare.heading")}
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {t("home.categories.eyeCare.description")}
            </p>
          </div>
          <div className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-900 transition-all hover:scale-105 hover:bg-slate-50">
            {t("home.categories.eyeCare.cta")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default CategoriesSection;
