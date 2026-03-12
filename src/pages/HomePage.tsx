import { useProducts } from "../hooks/useProducts";
import { useTranslation } from "../hooks/useTranslation";

import {
  HeroSection,
  BestSellersSection,
  ShopByBrandSection,
  OffersSection,
  CategoriesSection,
} from "../components/home-page";

const TRUST_STATS = [
  { icon: "👓", key: "home.trustBar.frames" },
  { icon: "👁️", key: "home.trustBar.freeExam" },
  { icon: "🚚", key: "home.trustBar.freeShipping" },
  { icon: "↩️", key: "home.trustBar.returns" },
] as const;

const TrustBar = () => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {TRUST_STATS.map(({ icon, key }) => (
        <div
          key={key}
          className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-soft ring-1 ring-slate-100"
        >
          <span className="text-2xl" aria-hidden="true">
            {icon}
          </span>
          <span className="text-sm font-semibold text-slate-700">
            {t(key)}
          </span>
        </div>
      ))}
    </div>
  );
};

const HomePage = () => {
  const { products: sunglassesProducts } = useProducts("sunglasses");
  const { products: glassesProducts } = useProducts("glasses");

  return (
    <div className="space-y-16 pb-8">
      <HeroSection />
      <TrustBar />
      <BestSellersSection
        glassesProducts={glassesProducts}
        sunglassesProducts={sunglassesProducts}
      />
      <ShopByBrandSection />
      <OffersSection />
      <CategoriesSection />
    </div>
  );
};

export default HomePage;
