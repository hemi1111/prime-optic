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
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
        {FEATURED_BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            to={`/brand/${brand.slug}`}
            className="group flex max-h-32 min-h-0 min-w-0 shrink-0 grow-0 basis-[calc((100%-3rem)/3)] items-center justify-center p-3 sm:max-h-36 sm:basis-[calc((100%-4rem)/3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            <img
              src={brand.image}
              alt={brand.name}
              loading="lazy"
              className="h-auto max-h-24 w-auto max-w-full object-contain opacity-60 transition duration-300 ease-out group-hover:opacity-100 sm:max-h-28"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByBrandSection;
