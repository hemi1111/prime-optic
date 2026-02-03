import { Link } from "react-router-dom";

import { useTranslation } from "../../hooks/useTranslation";

import type { Product } from "../../types/product";

import ProductCard from "../ProductCard";

type BestSellersSectionProps = {
  products: Product[];
};

const BestSellersSection = ({ products }: BestSellersSectionProps) => {
  const { t } = useTranslation();
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="container mx-auto px-6 md:px-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t("home.bestSellers.title")}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("home.bestSellers.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center">
        <Link
          to="/glasses"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t("home.bestSellers.viewAll")}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
};

export default BestSellersSection;
