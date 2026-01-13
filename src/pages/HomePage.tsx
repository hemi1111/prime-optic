import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-white shadow-strong md:px-12 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(48,85,245,0.15),transparent_50%)]" />
        <div className="relative grid gap-8 md:grid-cols-[1.2fr,1fr] md:items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-100 ring-1 ring-white/20 backdrop-blur-sm">
              {t('home.hero.tagline')}
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {t('home.hero.title')}{' '}
              <span className="bg-gradient-to-r from-primary-300 to-primary-200 bg-clip-text text-transparent">
                {t('home.hero.titleHighlight')}
              </span>{' '}
              for every moment.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-200 md:text-lg">
              {t('home.hero.description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/glasses"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:scale-105 hover:bg-primary-600 hover:shadow-lg"
              >
                {t('home.hero.shopGlasses')}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                to="/sunglasses"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-primary-300 hover:bg-white/10 hover:text-primary-200"
              >
                {t('home.hero.shopSunglasses')}
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center animate-scale-in">
            <div className="relative h-64 w-64 md:h-80 md:w-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-slate-900 shadow-strong" />
              <div className="absolute inset-8 rounded-3xl border-2 border-white/30 bg-white/10 backdrop-blur-md" />
              <div className="absolute -bottom-6 left-1/2 w-48 -translate-x-1/2 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center text-sm text-slate-100 backdrop-blur-md ring-1 ring-white/20 shadow-medium">
                <div className="font-bold">{t('home.hero.freeCheckup')}</div>
                <div className="mt-1 text-xs text-slate-200">
                  {t('home.hero.bookAppointment')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {t('home.offers.title')}
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
                {t('home.offers.promotion.title')}
              </div>
              <div className="text-lg font-bold text-slate-900">
                {t('home.offers.promotion.heading')}
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                {t('home.offers.promotion.description')}
              </p>
            </div>
            <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
              {t('home.offers.promotion.cta')}
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
                {t('home.offers.kids.title')}
              </div>
              <div className="text-lg font-bold text-slate-900">
                {t('home.offers.kids.heading')}
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                {t('home.offers.kids.description')}
              </p>
            </div>
            <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
              {t('home.offers.kids.cta')}
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
                {t('home.offers.blueLight.title')}
              </div>
              <div className="text-lg font-bold">
                {t('home.offers.blueLight.heading')}
              </div>
              <p className="text-sm leading-relaxed text-slate-200">
                {t('home.offers.blueLight.description')}
              </p>
            </div>
            <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-white transition-colors group-hover:text-slate-100">
              {t('home.offers.blueLight.cta')}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {t('home.categories.title')}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/glasses"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-medium hover:ring-primary-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-primary-600">
                {t('home.categories.glasses.title')}
              </div>
              <div className="text-lg font-bold text-slate-900">
                {t('home.categories.glasses.heading')}
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                {t('home.categories.glasses.description')}
              </p>
            </div>
            <div className="relative mt-6 flex items-center gap-2 text-xs font-semibold text-primary-600 transition-all group-hover:gap-3">
              {t('home.categories.glasses.cta')}
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
                {t('home.categories.sunglasses.title')}
              </div>
              <div className="text-lg font-bold text-slate-900">
                {t('home.categories.sunglasses.heading')}
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                {t('home.categories.sunglasses.description')}
              </p>
            </div>
            <div className="relative mt-6 flex items-center gap-2 text-xs font-semibold text-primary-600 transition-all group-hover:gap-3">
              {t('home.categories.sunglasses.cta')}
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
                {t('home.categories.eyeCare.title')}
              </div>
              <div className="text-lg font-bold">
                {t('home.categories.eyeCare.heading')}
              </div>
              <p className="text-sm leading-relaxed text-slate-200">
                {t('home.categories.eyeCare.description')}
              </p>
            </div>
            <div className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-900 transition-all hover:scale-105 hover:bg-slate-50">
              {t('home.categories.eyeCare.cta')}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
