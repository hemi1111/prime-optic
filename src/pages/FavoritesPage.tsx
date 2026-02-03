import { useFavoritesStore } from "../store/useFavoritesStore";
import { useTranslation } from "../hooks/useTranslation";
import ProductCard from "../components/ProductCard";

const FavoritesPage = () => {
  const { t } = useTranslation();
  const { favorites, clearFavorites, getFavoritesCount } = useFavoritesStore();

  const favoritesCount = getFavoritesCount();

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {t("favorites.title")}
          </h1>
          {favoritesCount > 0 && (
            <button
              onClick={clearFavorites}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
            >
              {t("favorites.clearAll")}
            </button>
          )}
        </div>
        <p className="text-base text-slate-600 md:text-lg">
          {favoritesCount > 0
            ? t("favorites.description").replace(
                "{count}",
                favoritesCount.toString(),
              )
            : t("favorites.emptyDescription")}
        </p>
      </header>

      {/* Favorites Grid */}
      {favoritesCount > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((product, idx) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
          <div className="text-6xl">💝</div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              {t("favorites.empty.title")}
            </h2>
            <p className="max-w-md text-sm text-slate-600">
              {t("favorites.empty.description")}
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/glasses"
              className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors"
            >
              {t("favorites.empty.browseGlasses")}
            </a>
            <a
              href="/sunglasses"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              {t("favorites.empty.browseSunglasses")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
