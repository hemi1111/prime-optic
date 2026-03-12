import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { type Product, type CartItem } from "../types/product";
import { getProductImages, getProductThumbnail } from "../utils/productDetail";

import { useCartStore } from "../store/useCartStore";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useTranslation } from "../hooks/useTranslation";
import { useCurrency } from "../hooks/useCurrency";
import { useToast } from "../hooks/useToast";
import Button from "./ui/Button";
import Card from "./ui/Card";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const toast = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const { addToFavorites, removeFromFavorites, isFavorite } =
    useFavoritesStore();
  const [isAdding, setIsAdding] = useState(false);
  const [showBlueLightOption, setShowBlueLightOption] = useState(false);
  const [addBlueLightFilter, setAddBlueLightFilter] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const isWishlisted = isFavorite(product.id);

  const blueLightFilterPrice = product.blueLightFilterPrice || 25;
  const finalPrice = product.price;

  const { primaryImage, hoverImage } = useMemo(() => {
    const images = getProductImages(product);
    const primary = getProductThumbnail(product) ?? images[0];
    const hover = images.length > 1 ? images[1] : primary;
    return { primaryImage: primary, hoverImage: hover };
  }, [product]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.blueLightFilter && !showBlueLightOption) {
      setShowBlueLightOption(true);
      return;
    }

    setIsAdding(true);
    const cartPrice = addBlueLightFilter
      ? finalPrice + blueLightFilterPrice
      : finalPrice;

    const selectedColor = product.colorOptions?.[selectedColorIndex];
    addItem(
      {
        id: product.id,
        name: product.name,
        price: cartPrice,
        imageUrl: getProductThumbnail(product) ?? product.imageUrl,
        slug: product.slug,
        brand: product.brand,
        type: product.type,
        addBlueLightFilter,
        selectedColorName: selectedColor?.name,
      } as CartItem,
      1,
    );

    toast.success(t("toast.addToCart.success"));

    setTimeout(() => {
      setIsAdding(false);
      setShowBlueLightOption(false);
      setAddBlueLightFilter(false);
    }, 300);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromFavorites(product.id);
      toast.success(t("toast.removeFromFavorites.success"));
    } else {
      addToFavorites(product);
      toast.success(t("toast.addToFavorites.success"));
    }
  };

  return (
    <Card
      as="article"
      padding="none"
      className="group relative w-full md:max-w-sm mx-auto shadow-lg transition-shadow duration-300 hover:shadow-xl"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="relative w-full aspect-[4/3] bg-white">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.isBestSeller && (
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Best Seller
              </span>
            )}
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                New
              </span>
            )}
          </div>

          {/* Product Image with hover swap (uses primary + next image when available) */}
          {primaryImage ? (
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={primaryImage}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-300 group-hover:opacity-0"
              />
              <img
                src={hoverImage}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-4xl mb-2">👓</div>
              <span className="text-sm">Product image</span>
            </div>
          )}

          {/* Sale Badge */}
          {product.oldPrice && product.oldPrice > product.price && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100,
              )}
              %
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 sm:p-4 space-y-2.5">
        {/* Rating and Reviews */}
        {product.rating && (
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <div className="flex">{renderStars(product.rating)}</div>
            {product.reviewCount && (
              <span className="text-xs text-slate-500">
                ({product.reviewCount} {t("common.reviews")})
              </span>
            )}
          </div>
        )}

        {/* Product Title */}
        <div>
          <Link
            to={`/products/${product.slug}`}
            className="font-bold text-slate-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">{t("common.by")} {product.brand}</p>
        </div>

        {/* Color Options */}
        {product.colorOptions && product.colorOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0">{t("common.color")}:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.colorOptions.map((color, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColorIndex(index);
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    selectedColorIndex === index
                      ? "border-primary-500 shadow-md"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(finalPrice)}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="icon"
            size="icon"
            onClick={toggleWishlist}
            className={`shrink-0 ${
              isWishlisted
                ? "border-red-500 text-red-500 bg-red-50"
                : ""
            }`}
            aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              className="w-4 h-4"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding}
            loading={isAdding}
            className="flex-1 min-w-0 text-xs sm:text-sm"
          >
            <span className="truncate">
              {showBlueLightOption
                ? t("common.confirmSelection")
                : t("common.addToCart")}
            </span>
          </Button>
        </div>

        {/* Blue Light Filter Option */}
        {showBlueLightOption && product.blueLightFilter && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`bluelight-${product.id}`}
                checked={addBlueLightFilter}
                onChange={(e) => setAddBlueLightFilter(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor={`bluelight-${product.id}`}
                className="text-sm font-medium text-gray-800"
              >
                {t("common.addBlueLightFilter")} (
                {formatPrice(blueLightFilterPrice)})
              </label>
            </div>
            <p className="text-xs text-blue-600">{t("common.protectsEyes")}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
