import { useState } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "../../hooks/useTranslation";

import type { Product } from "../../types/product";

import ProductCard from "../ProductCard";

type BestSellersSectionProps = {
  glassesProducts: Product[];
  sunglassesProducts: Product[];
};

const BestSellersSection = ({
  glassesProducts,
  sunglassesProducts,
}: BestSellersSectionProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"sunglasses" | "glasses">(
    "sunglasses"
  );

  const products =
    activeTab === "sunglasses" ? sunglassesProducts : glassesProducts;
  const featuredProducts = products.slice(0, 6);
  const viewAllHref = activeTab === "sunglasses" ? "/sunglasses" : "/glasses";

  return (
    <section className="container mx-auto px-6 md:px-12">
      <div className="flex flex-col items-center mb-10 gap-5 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            {t("home.bestSellers.title")}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t("home.bestSellers.description")}
          </p>
        </div>

        <div className="flex gap-1 rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("sunglasses")}
            className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "sunglasses"
                ? "bg-primary-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("nav.sunglasses")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("glasses")}
            className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "glasses"
                ? "bg-primary-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("nav.glasses")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center">
        <Link
          to={viewAllHref}
          className="group inline-flex items-center gap-2 px-8 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-300 hover:scale-105 font-semibold shadow-sm"
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
