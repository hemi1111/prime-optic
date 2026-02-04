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
} from "../utils/productDetail";

import { useCartStore } from "../store/useCartStore";

import {
  ProductDetailSkeleton,
  ProductDetailError,
  ProductDetailNotFound,
  StoreLocationsModal,
  ImageMagnifier,
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
        imageUrl: product.imageUrl,
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          {product.imageUrl ? (
            <ImageMagnifier
              src={product.imageUrl}
              alt={product.name}
              zoomLevel={2.5}
              magnifierSize={200}
            />
          ) : (
            <div className="w-full h-96 lg:h-[500px] bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-500 text-lg">
                {t("common.noImage")}
              </span>
            </div>
          )}

          {/* Size Guide */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              {t("productDetail.sizeGuide")}
            </h3>
            <p className="text-sm text-blue-700">
              {t("productDetail.sizesInMm")}
            </p>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {product.brand}
              </span>
              {product.gender && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {getGenderLabel(t, product.gender)}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-gray-500">
                {t("productDetail.sku")}: {product.sku}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                €{product.price.toFixed(2)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  €{product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("productDetail.freeShipping")}
              </span>
              <button
                onClick={() => setIsStoreModalOpen(true)}
                className="text-gray-600 hover:text-primary-600 transition-colors cursor-pointer underline"
              >
                {t("productDetail.tryInStore")}
              </button>
            </div>
          </div>

          {/* Blue Light Filter Option */}
          {product.blueLightFilter && product.blueLightFilterPrice && (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">
                    {t("catalog.blueLightFilter")}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {t("catalog.protectYourEyes")}
                  </p>
                </div>
                <span className="font-semibold text-blue-900">
                  +€{product.blueLightFilterPrice}
                </span>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            {t("common.addToCart")} - €{product.price.toFixed(2)}
          </button>

          {/* Product Details */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t("productDetail.productDetails")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  {t("productDetail.specifications")}
                </h3>
                <div className="space-y-3 text-sm">
                  {product.frameMaterial && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("productDetail.frameMaterial")}:
                      </span>
                      <span className="font-medium">
                        {getMaterialLabel(t, product.frameMaterial)}
                      </span>
                    </div>
                  )}
                  {product.frameColor && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("productDetail.frameColor")}:
                      </span>
                      <span className="font-medium">{product.frameColor}</span>
                    </div>
                  )}
                  {product.frameShape && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("productDetail.frameShape")}:
                      </span>
                      <span className="font-medium">
                        {getShapeLabel(t, product.frameShape)}
                      </span>
                    </div>
                  )}
                  {product.lensColor && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("productDetail.lensColor")}:
                      </span>
                      <span className="font-medium">{product.lensColor}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("productDetail.weight")}:
                      </span>
                      <span className="font-medium">{product.weight}g</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  Dimensions (mm)
                </h3>
                <div className="space-y-3 text-sm">
                  {product.lensWidth && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("productDetail.lensWidth")}:
                      </span>
                      <span className="font-medium">{product.lensWidth}</span>
                    </div>
                  )}
                  {product.bridgeWidth && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("productDetail.bridgeWidth")}:
                      </span>
                      <span className="font-medium">{product.bridgeWidth}</span>
                    </div>
                  )}
                  {product.templeLength && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("productDetail.templeLength")}:
                      </span>
                      <span className="font-medium">
                        {product.templeLength}
                      </span>
                    </div>
                  )}
                  {product.lensHeight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("productDetail.lensHeight")}:
                      </span>
                      <span className="font-medium">{product.lensHeight}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>Total:</span>
                    <span>
                      {formatDimensionsUtil(
                        t,
                        product.lensWidth,
                        product.bridgeWidth,
                        product.templeLength,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 space-y-4">
              {product.lenseTechnology && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t("productDetail.lenseTechnology")}
                  </h4>
                  <p className="text-gray-700">{product.lenseTechnology}</p>
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t("productDetail.features")}
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t("productDetail.description")}
                  </h4>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                {product.origin && (
                  <span>
                    {t("productDetail.origin")}: {product.origin}
                  </span>
                )}
                {product.warranty && (
                  <span>
                    {t("productDetail.warranty")}: {product.warranty}
                  </span>
                )}
                {product.upc && (
                  <span>
                    {t("productDetail.upc")}: {product.upc}
                  </span>
                )}
              </div>
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
