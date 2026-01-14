import { useState } from "react";

import { Link } from "react-router-dom";
import { type Product } from "../types/product";
import { useCartStore } from "../store/useCartStore";
import { useTranslation } from "../hooks/useTranslation";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      1
    );
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-medium hover:ring-primary-200">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300 group-hover:from-slate-100 group-hover:to-slate-200">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <div className="text-4xl">👓</div>
              <span className="text-xs font-medium">Product image</span>
            </div>
          )}
          {product.oldPrice && product.oldPrice > product.price && (
            <div className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              -
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              )}
              %
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
            {product.brand}
          </div>
          <Link
            to={`/products/${product.slug}`}
            className="line-clamp-2 text-base font-bold text-slate-900 transition-colors hover:text-primary-600"
          >
            {product.name}
          </Link>
        </div>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            €{product.price.toFixed(2)}
          </span>
          {product.oldPrice && product.oldPrice > product.price ? (
            <span className="text-sm text-slate-400 line-through">
              €{product.oldPrice.toFixed(2)}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="group/btn relative mt-2 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-primary-600 hover:shadow-md disabled:opacity-60 disabled:hover:scale-100"
        >
          <span
            className={`transition-transform duration-300 ${
              isAdding ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            {t("product.addToCart")}
          </span>
          {isAdding && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
