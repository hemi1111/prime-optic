import { useState } from "react";
import { useParams } from "react-router-dom";

import { useProductBySlug } from "../hooks/useProducts";
import { useTranslation } from "../hooks/useTranslation";
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

import {
  ProductDetailSkeleton,
  ProductDetailError,
  ProductDetailNotFound,
  StoreLocationsModal,
  ProductImageSlider,
} from "../components/product-detail-page";

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, error } = useProductBySlug(slug);
  const addItem = useCartStore((state) => state.addItem);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: getProductThumbnail(product) ?? product.imageUrl,
        slug: product.slug,
        brand: product.brand,
        type: product.type,
      },
      1,
    );
    toast.success(t("toast.addToCart.success"));
  };

  if (isLoading) return <ProductDetailSkeleton />;
  if (error) return <ProductDetailError error={error} />;
  if (!product) return <ProductDetailNotFound />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
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

          {/* Size Guide */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">
              {t("productDetail.sizeGuide")}
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              {t("productDetail.sizesInMm")}
            </p>
            <img
              src="https://assets.glassesdirect.co.uk/media/filer_public/07/76/07765c92-6dc2-47cc-b3d4-56093aa93a99/diagram-glasses-frame-size-medium-glassesdirect.png"
              alt={t("productDetail.sizeGuide")}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
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
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-slate-500 text-sm">
                {t("productDetail.sku")}: {product.sku}
              </p>
            )}
          </div>

          {/* Price & CTA block */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 ring-1 ring-slate-100 space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-slate-900">
                €{product.price.toFixed(2)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xl text-slate-500 line-through">
                  €{product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-emerald-600 flex items-center gap-1 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t("productDetail.freeShipping")}
              </span>
              <button
                type="button"
                onClick={() => setIsStoreModalOpen(true)}
                className="text-slate-600 hover:text-primary-600 transition-colors cursor-pointer underline font-medium"
              >
                {t("productDetail.tryInStore")}
              </button>
            </div>

            {product.blueLightFilter && product.blueLightFilterPrice && (
              <div className="rounded-lg border border-primary-200 bg-primary-50/80 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-primary-900">
                      {t("common.blueLightFilter")}
                    </h4>
                    <p className="text-sm text-primary-700">
                      {t("catalog.protectYourEyes")}
                    </p>
                  </div>
                  <span className="font-semibold text-primary-900">
                    +€{product.blueLightFilterPrice}
                  </span>
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
              {t("common.addToCart")} — €{product.price.toFixed(2)}
            </button>
          </div>

          {/* Product Details card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {t("productDetail.productDetails")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
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

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
              {product.origin && <span>{t("productDetail.origin")}: {product.origin}</span>}
              {product.warranty && <span>{t("productDetail.warranty")}: {product.warranty}</span>}
              {product.upc && <span>{t("productDetail.upc")}: {product.upc}</span>}
            </div>
          </div>
        </div>
      </div>

      <StoreLocationsModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetailPage;
