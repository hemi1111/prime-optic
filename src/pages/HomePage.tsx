import { useProducts } from "../hooks/useProducts";

import {
  HeroSection,
  BestSellersSection,
  ShopByBrandSection,
  OffersSection,
  CategoriesSection,
} from "../components/home-page";

const HomePage = () => {
  const { products } = useProducts("sunglasses");

  return (
    <div className="space-y-16 pb-8">
      <HeroSection />
      <BestSellersSection products={products} />
      <ShopByBrandSection />
      <OffersSection />
      <CategoriesSection />
    </div>
  );
};

export default HomePage;
