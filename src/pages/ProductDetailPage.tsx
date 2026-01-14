import { useParams } from "react-router-dom";
import { useProductBySlug } from "../hooks/useProducts";
import { useCartStore } from "../store/useCartStore";
import { useTranslation } from "../hooks/useTranslation";

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, error } = useProductBySlug(slug);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      1
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <header>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Product details
          </p>
          <div className="mt-2 h-6 w-48 animate-pulse rounded bg-slate-100" />
        </header>
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
          <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
          <div className="space-y-3 rounded-2xl bg-slate-50 p-6">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t("product.notFound")}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {t("product.notFound")}
        </h1>
        <p className="max-w-md text-sm text-slate-500">
          It may have been removed or is not yet available in the online
          catalog. Please browse our other products or adjust your selection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {product.type === "glasses" ? "Glasses" : "Sunglasses"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {product.name}
        </h1>
        <p className="text-sm text-slate-500">{product.brand}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
        <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <div className="flex h-72 items-center justify-center rounded-xl bg-slate-100">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-56 w-auto object-contain"
              />
            ) : (
              <span className="text-xs text-slate-400">Product gallery</span>
            )}
          </div>
        </div>
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-semibold text-slate-900">
                €{product.price.toFixed(2)}
              </div>
              {product.oldPrice && product.oldPrice > product.price ? (
                <div className="text-sm text-slate-400 line-through">
                  €{product.oldPrice.toFixed(2)}
                </div>
              ) : null}
            </div>
            <p className="text-sm text-slate-600">
              Detailed frame specifications, lens options and availability will
              be shown here once product data is populated.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
          >
            {t("product.addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
