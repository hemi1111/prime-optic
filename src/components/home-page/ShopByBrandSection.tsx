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
      <div className="grid grid-cols-1 gap-x-24 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {FEATURED_BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            to={`/brand/${brand.slug}`}
            className="group flex items-center justify-center px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            <img
              src={brand.image}
              alt={brand.name}
              loading="lazy"
              className="h-10 w-auto max-w-[220px] opacity-70 transition duration-300 ease-out group-hover:opacity-100 md:h-12 md:max-w-[260px] lg:h-14 lg:max-w-[280px]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByBrandSection;
