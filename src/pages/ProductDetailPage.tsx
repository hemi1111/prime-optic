import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";

import { useProductBySlug, useProducts } from "../hooks/useProducts";
import { useStoreLocations } from "../hooks/useStoreLocations";
import { useTranslation } from "../hooks/useTranslation";
import { useCurrency } from "../hooks/useCurrency";
import { useToast } from "../hooks/useToast";
import {
  getGenderLabel,
  getMaterialLabel,
  getShapeLabel,
  formatDimensions as formatDimensionsUtil,
  getProductThumbnail,
  getProductImages,
} from "../utils/productDetail";

import { useCartStore } from "../store/useCartStore";
import type { CartItem } from "../types/product";

import ProductCard from "../components/ProductCard";
import {
  ProductDetailSkeleton,
  ProductDetailError,
  ProductDetailNotFound,
  StoreLocationsModal,
  ProductImageSlider,
  SizeGuideDiagram,
} from "../components/product-detail-page";
import { stateSwapVariants } from "../config/motion";

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const toast = useToast();
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, error } = useProductBySlug(slug);
  const { stores } = useStoreLocations();
  const { products: sameTypeProducts } = useProducts(
    product?.type ?? "glasses"
  );
  const addItem = useCartStore((state) => state.addItem);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [addBlueLightFilter, setAddBlueLightFilter] = useState(false);
  const [relatedIndex, setRelatedIndex] = useState(0);
  const [relatedDirection, setRelatedDirection] = useState(0);
  const [relatedTouchStartX, setRelatedTouchStartX] = useState<number | null>(null);

  const blueLightFilterPrice = product?.blueLightFilterPrice ?? 25;
  const cartPrice =
    product && addBlueLightFilter && product.blueLightFilter
      ? product.price + blueLightFilterPrice
      : product?.price ?? 0;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return sameTypeProducts
      .filter(
        (p) => p.id !== product.id && p.brand === product.brand
      )
      .slice(0, 5);
  }, [product, sameTypeProducts]);

  useEffect(() => {
    setRelatedIndex(0);
  }, [relatedProducts.length, product?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    const selectedColor = product.colorOptions?.[selectedColorIndex];
    const payload: Omit<CartItem, "quantity"> = {
      id: product.id,
      name: product.name,
      price: cartPrice,
      imageUrl: getProductThumbnail(product) ?? product.imageUrl,
      slug: product.slug,
      brand: product.brand,
      type: product.type,
      addBlueLightFilter: product.blueLightFilter ? addBlueLightFilter : undefined,
      selectedColorName: selectedColor?.name,
    };
    addItem(payload, 1);
    toast.success(t("toast.addToCart.success"));
  };

  if (error) return <ProductDetailError error={error} />;
  if (!product && !isLoading) return <ProductDetailNotFound />;

  const goPrevRelated = () => {
    setRelatedDirection(-1);
    setRelatedIndex((prev) =>
      prev === 0 ? relatedProducts.length - 1 : prev - 1
    );
  };

  const goNextRelated = () => {
    setRelatedDirection(1);
    setRelatedIndex((prev) =>
      prev === relatedProducts.length - 1 ? 0 : prev + 1
    );
  };

  const handleRelatedTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setRelatedTouchStartX(e.changedTouches[0]?.clientX ?? null);
  };

  const handleRelatedTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (relatedTouchStartX == null || relatedProducts.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? relatedTouchStartX;
    const deltaX = relatedTouchStartX - endX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) goNextRelated();
      else goPrevRelated();
    }
    setRelatedTouchStartX(null);
  };

  const hasSizeData =
    product != null &&
    product.lensWidth != null &&
    product.bridgeWidth != null &&
    product.templeLength != null;

  const sizeGuideBlock =
    hasSizeData && product ? (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-soft ring-1 ring-slate-100 lg:p-4">
        <h3 className="font-semibold text-slate-900 mb-2">
          {t("productDetail.sizeGuide")}
        </h3>
        <p className="text-sm text-slate-600 mb-3">
          {t("productDetail.sizesInMm")}
        </p>
        <SizeGuideDiagram product={product} t={t} />
      </div>
    ) : null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isLoading || !product ? (
        <motion.div
          key="loading"
          variants={stateSwapVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <ProductDetailSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={stateSwapVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-3 pb-8 pt-3 lg:px-4 lg:pb-12 lg:pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-6 lg:gap-x-8 lg:gap-y-8 lg:grid-rows-[auto_auto_auto]">
        {/* Left row 1: title only */}
        <div className="order-1 lg:col-start-1 lg:row-start-1">
          <div className="space-y-1.5 lg:space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                {product.brand}
              </span>
              {product.gender && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    {getGenderLabel(t, product.gender)}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-slate-500 text-sm">
                {t("productDetail.sku")}: {product.sku}
              </p>
            )}
          </div>
        </div>

        {/* Left row 2: image + size guide (no gap between them) */}
        <div className="order-2 flex flex-col gap-4 lg:col-start-1 lg:row-start-2 min-h-0">
          <div className="min-h-0">
            {getProductImages(product).length > 0 ? (
              <ProductImageSlider
                images={getProductImages(product)}
                alt={product.name}
                zoomLevel={1.35}
                magnifierSize={160}
              />
            ) : (
              <div className="w-full aspect-square max-h-[500px] bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-slate-500 text-lg">
                  {t("common.noImage")}
                </span>
              </div>
            )}
          </div>
          {hasSizeData && (
            <div className="hidden lg:block">
              {sizeGuideBlock}
            </div>
          )}
        </div>

        {/* Size guide on mobile only: last in order */}
        {hasSizeData && (
          <div className="order-6 lg:hidden">
            {sizeGuideBlock}
          </div>
        )}

        {/* Color options: order 3, right column - mobile only; on desktop it's inside the add-to-cart card */}
        {product.colorOptions && product.colorOptions.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-soft ring-1 ring-slate-100 order-3 lg:hidden">
              <p className="text-sm font-medium text-slate-700 mb-3">
                {t("common.color")}:{" "}
                <span className="font-semibold text-slate-900">
                  {product.colorOptions[selectedColorIndex]?.name}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colorOptions.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedColorIndex(index)}
                    className={`w-8 h-8 rounded-full border-2 transition-all shrink-0 ${
                      selectedColorIndex === index
                        ? "border-primary-500 ring-2 ring-primary-200 shadow-md"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>
          )}

        {/* Right column: add-to-cart + product details stacked, aligned with image (row 2); sticky on desktop */}
        <div className="order-4 flex flex-col gap-4 lg:col-start-2 lg:row-start-2 lg:sticky lg:top-20 lg:self-start">
        {/* Price & CTA block - includes color picker on desktop, fit-content height */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 ring-1 ring-slate-100 space-y-4 h-fit lg:p-6">
            {/* Color picker - desktop only (inside add-to-cart card) */}
            {product.colorOptions && product.colorOptions.length > 0 && (
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  {t("common.color")}:{" "}
                  <span className="font-semibold text-slate-900">
                    {product.colorOptions[selectedColorIndex]?.name}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colorOptions.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedColorIndex(index)}
                      className={`w-8 h-8 rounded-full border-2 transition-all shrink-0 ${
                        selectedColorIndex === index
                          ? "border-primary-500 ring-2 ring-primary-200 shadow-md"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xl text-slate-500 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-emerald-600 flex items-center gap-1 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t("productDetail.freeShipping", { amount: formatPrice(100) })}
              </span>
              <button
                type="button"
                onClick={() => setIsStoreModalOpen(true)}
                className="text-slate-600 hover:text-primary-600 transition-colors cursor-pointer underline font-medium"
              >
                {t("productDetail.tryInStore")}
              </button>
            </div>

            {product.blueLightFilter && product.blueLightFilterPrice != null && (
              <div className="rounded-lg border border-primary-200 bg-primary-50/80 p-3 space-y-3 lg:p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="detail-bluelight"
                    checked={addBlueLightFilter}
                    onChange={(e) => setAddBlueLightFilter(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 rounded border-primary-300 focus:ring-2 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="detail-bluelight"
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium text-primary-900">
                      {t("common.addBlueLightFilter")}{" "}
                      <span className="font-semibold text-primary-800">
                        (+{formatPrice(blueLightFilterPrice)})
                      </span>
                    </span>
                    <p className="text-sm text-primary-700 mt-0.5">
                      {t("common.blueLightDescription")}
                    </p>
                  </label>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 bg-size-200 bg-pos-0 px-6 py-4 text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-pos-100 hover:shadow-primary-500/25 active:scale-[0.98]"
              style={{ backgroundSize: "200% 100%", backgroundPosition: "0% 0%" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundPosition = "100% 0%";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundPosition = "0% 0%";
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t("common.addToCart")} — {formatPrice(cartPrice)}
            </button>
        </div>

        {/* Product Details card - directly below add-to-cart, no gap */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft ring-1 ring-slate-100 lg:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3 lg:mb-4">
              {t("productDetail.productDetails")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  {t("productDetail.specifications")}
                </h3>
                <dl className="space-y-2 text-sm">
                  {product.frameMaterial && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-600">{t("productDetail.frameMaterial")}</dt>
                      <dd className="font-medium text-slate-900">{getMaterialLabel(t, product.frameMaterial)}</dd>
                    </div>
                  )}
                  {product.frameColor && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-600">{t("productDetail.frameColor")}</dt>
                      <dd className="font-medium text-slate-900">{product.frameColor}</dd>
                    </div>
                  )}
                  {product.frameShape && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-600">{t("productDetail.frameShape")}</dt>
                      <dd className="font-medium text-slate-900">{getShapeLabel(t, product.frameShape)}</dd>
                    </div>
                  )}
                  {product.lensColor && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-600">{t("productDetail.lensColor")}</dt>
                      <dd className="font-medium text-slate-900">{product.lensColor}</dd>
                    </div>
                  )}
                  {product.weight != null && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-600">{t("productDetail.weight")}</dt>
                      <dd className="font-medium text-slate-900">{product.weight}g</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  {t("productDetail.dimensions")}
                </h3>
                <dl className="space-y-2 text-sm">
                  {product.lensWidth != null && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-600">{t("productDetail.lensWidth")}</dt>
                      <dd className="font-medium text-slate-900">{product.lensWidth} mm</dd>
                    </div>
                  )}
                  {product.bridgeWidth != null && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-600">{t("productDetail.bridgeWidth")}</dt>
                      <dd className="font-medium text-slate-900">{product.bridgeWidth} mm</dd>
                    </div>
                  )}
                  {product.templeLength != null && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-600">{t("productDetail.templeLength")}</dt>
                      <dd className="font-medium text-slate-900">{product.templeLength} mm</dd>
                    </div>
                  )}
                  {product.lensHeight != null && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-600">{t("productDetail.lensHeight")}</dt>
                      <dd className="font-medium text-slate-900">{product.lensHeight} mm</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-2 pt-1 font-medium text-slate-900">
                    <dt>Total</dt>
                    <dd>
                      {formatDimensionsUtil(t, product.lensWidth, product.bridgeWidth, product.templeLength)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {(product.lenseTechnology || (product.features && product.features.length > 0) || product.description) && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 lg:mt-6 lg:pt-6">
                {product.lenseTechnology && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1">{t("productDetail.lenseTechnology")}</h4>
                    <p className="text-slate-600 text-sm">{product.lenseTechnology}</p>
                  </div>
                )}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1">{t("productDetail.features")}</h4>
                    <ul className="list-disc list-inside text-slate-600 text-sm space-y-0.5">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1">{t("productDetail.description")}</h4>
                    <p className="text-slate-600 text-sm">{product.description}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-xs text-slate-500 lg:mt-4 lg:pt-4 lg:gap-4">
              {product.origin && <span>{t("productDetail.origin")}: {product.origin}</span>}
              {product.warranty && <span>{t("productDetail.warranty")}: {product.warranty}</span>}
              {product.upc && <span>{t("productDetail.upc")}: {product.upc}</span>}
            </div>
        </div>
        </div>
      </div>

            {relatedProducts.length > 0 && (
              <section className="border-t border-slate-200 pt-6 lg:pt-8">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                      {t("productDetail.youMayAlsoLike")}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {t("productDetail.relatedSubtitle")}
                    </p>
                  </div>
                </div>
                <div
                  className="relative lg:hidden"
                  onTouchStart={handleRelatedTouchStart}
                  onTouchEnd={handleRelatedTouchEnd}
                >
                  <AnimatePresence mode="wait" initial={false} custom={relatedDirection}>
                    <motion.div
                      key={relatedProducts[relatedIndex]?.id}
                      custom={relatedDirection}
                      variants={{
                        enter: (dir: number) => ({
                          x: dir > 0 ? 80 : dir < 0 ? -80 : 0,
                          opacity: 0,
                          scale: 0.98,
                        }),
                        center: {
                          x: 0,
                          opacity: 1,
                          scale: 1,
                          transition: {
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                        exit: (dir: number) => ({
                          x: dir > 0 ? -80 : dir < 0 ? 80 : 0,
                          opacity: 0,
                          scale: 0.98,
                          transition: {
                            duration: 0.25,
                            ease: [0.4, 0, 1, 1],
                          },
                        }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <ProductCard product={relatedProducts[relatedIndex]} />
                    </motion.div>
                  </AnimatePresence>
                  {relatedProducts.length > 1 && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      {relatedProducts.map((related, index) => (
                        <button
                          key={related.id}
                          type="button"
                          onClick={() => {
                            if (index === relatedIndex) return;
                            setRelatedDirection(
                              index > relatedIndex ? 1 : -1
                            );
                            setRelatedIndex(index);
                          }}
                          className={`h-2.5 w-2.5 rounded-full transition-colors ${
                            index === relatedIndex
                              ? "bg-slate-900"
                              : "bg-slate-300"
                          }`}
                          aria-label={`Go to related product ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden gap-4 overflow-x-auto pb-2 lg:flex">
                  {relatedProducts.map((related) => (
                    <div
                      key={related.id}
                      className="min-w-[270px] max-w-[320px] flex-1"
                    >
                      <ProductCard product={related} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <StoreLocationsModal
              isOpen={isStoreModalOpen}
              onClose={() => setIsStoreModalOpen(false)}
              product={product}
              stores={stores}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailPage;
