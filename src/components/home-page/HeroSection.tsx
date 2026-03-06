import { Link } from "react-router-dom";

import { useTranslation } from "../../hooks/useTranslation";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-8 text-white shadow-strong md:px-12 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(48,85,245,0.15),transparent_50%)]" />
      <div className="relative grid gap-6 place-items-center md:grid-cols-[1.2fr,1fr] md:place-items-stretch md:items-center md:gap-8">
        <div className="space-y-5 text-center md:text-left animate-fade-in max-w-xl md:max-w-none">
          <div className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-100 ring-1 ring-white/20 backdrop-blur-sm">
            {t("home.hero.tagline")}
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {t("home.hero.title")}{" "}
            <span className="bg-gradient-to-r from-primary-300 to-primary-200 bg-clip-text text-transparent">
              {t("home.hero.titleHighlight")}
            </span>{" "}
            {t("home.hero.titleDescription")}
          </h1>
          <p className="text-base leading-relaxed text-slate-200 md:text-lg md:max-w-xl">
            {t("home.hero.description")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link
              to="/glasses"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:scale-105 hover:bg-primary-600 hover:shadow-lg"
            >
              {t("home.hero.shopGlasses")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              to="/sunglasses"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-primary-300 hover:bg-white/10 hover:text-primary-200"
            >
              {t("home.hero.shopSunglasses")}
            </Link>
          </div>
        </div>
        <div className="relative flex items-center justify-center animate-scale-in">
          <div className="relative h-48 w-48 md:h-80 md:w-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-slate-900 shadow-strong" />
            <div className="absolute inset-8 flex flex-col overflow-hidden rounded-3xl border-2 border-white/30 bg-white/10 backdrop-blur-md">
              <img
                src="/snellen-chart.svg"
                alt="Eye chart"
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 w-48 -translate-x-1/2 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center text-sm text-slate-100 backdrop-blur-md ring-1 ring-white/20 shadow-medium">
              <div className="font-bold">{t("home.hero.freeCheckup")}</div>
              <div className="mt-1 text-xs text-slate-200">
                {t("home.hero.bookAppointment")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
