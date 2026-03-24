import { Link } from "react-router-dom";

import { useTranslation } from "../hooks/useTranslation";
import SocialLinks from "../components/SocialLinks";
import { FEATURED_BRANDS } from "../config/brands";

const Footer = () => {
  const { t } = useTranslation();
  const topBrands = FEATURED_BRANDS.slice(0, 6);

  const footerLinkClass =
    "relative inline-block w-fit pb-0.5 text-sm text-slate-600 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary-500 after:transition-transform after:duration-300 hover:text-slate-900 hover:after:scale-x-100 focus-visible:outline-none focus-visible:after:scale-x-100";

  return (
    <footer className="border-t border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
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
              <div className="text-sm font-bold text-slate-700">
                {t("footer.shopName")}
              </div>
            </div>
            <p className="text-sm text-slate-500">{t("footer.tagline")}</p>
            <p className="text-sm text-slate-600">{t("footer.hours")}</p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-800">
              {t("footer.navigation")}
            </h4>
            <div className="space-y-2">
              <Link to="/" className={footerLinkClass}>
                {t("footer.nav.home")}
              </Link>
              <div>
                <Link to="/glasses" className={footerLinkClass}>
                  {t("footer.nav.glasses")}
                </Link>
              </div>
              <div>
                <Link to="/sunglasses" className={footerLinkClass}>
                  {t("footer.nav.sunglasses")}
                </Link>
              </div>
              <div>
                <Link to="/exam" className={footerLinkClass}>
                  {t("footer.nav.eyeExam")}
                </Link>
              </div>
              <div>
                <Link to="/custom-glasses" className={footerLinkClass}>
                  {t("footer.nav.customGlasses")}
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-800">
              {t("footer.brands")}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {topBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/brand/${brand.slug}`}
                  className={footerLinkClass}
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-800">
              {t("footer.storeLocations")}
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p>{t("footer.store1")}</p>
              <p>{t("footer.store2")}</p>
              <p>{t("footer.store3")}</p>
              <p className="pt-1 text-slate-700">{t("footer.address")}</p>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
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
                <a href="mailto:primeoptic@gmail.com" className={footerLinkClass}>
                  {t("footer.contact")}
                </a>
              </div>
              <div className="flex items-center gap-2">
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
                <a href="tel:+000111234" className={footerLinkClass}>
                  {t("footer.phone")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center border-t border-slate-200 pt-6">
          <SocialLinks className="w-44 justify-between gap-0" />
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
