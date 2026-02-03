import { Link } from "react-router-dom";

import { useTranslation } from "../../hooks/useTranslation";
import { FEATURED_BRANDS } from "../../config/brands";

const ShopByBrandSection = () => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto space-y-6 px-6 md:px-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {t("home.brands.title")}
        </h2>
        <p className="mt-2 max-w-2xl mx-auto text-slate-600">
          {t("home.brands.description")}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {FEATURED_BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            to={`/brand/${brand.slug}`}
            className="group flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center font-semibold text-slate-800 shadow-soft ring-1 ring-slate-100 transition-all duration-300 hover:scale-[1.02] hover:border-primary-300 hover:shadow-medium hover:ring-primary-200"
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByBrandSection;
