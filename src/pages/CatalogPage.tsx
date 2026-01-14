import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import type { ProductType } from "../types/product";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "../hooks/useTranslation";

type CatalogPageProps = {
  type: ProductType;
};

type SortOption = "price-low" | "price-high" | "newest" | "popular";

const CatalogPage = ({ type }: CatalogPageProps) => {
  const { t } = useTranslation();
  const { products, isLoading, error } = useProducts(type);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const title =
    type === "glasses" ? "Prescription glasses" : "Sunglasses collection";

  const hasResults = products.length > 0;

  const filterOptions = [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "round", label: "Round" },
    { id: "square", label: "Square" },
    { id: "cat-eye", label: "Cat-eye" },
    { id: "metal", label: "Metal" },
    { id: "plastic", label: "Plastic" },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h1>
        <p className="text-base text-slate-600 md:text-lg">
          Browse our curated selection of premium {type} frames.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                {t("catalog.filters")}
              </h2>
              {selectedFilters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFilters([])}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Gender
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions
                    .filter((f) => ["men", "women", "kids"].includes(f.id))
                    .map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => toggleFilter(filter.id)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                          selectedFilters.includes(filter.id)
                            ? "bg-primary-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Frame Shape
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions
                    .filter((f) =>
                      ["round", "square", "cat-eye"].includes(f.id)
                    )
                    .map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => toggleFilter(filter.id)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                          selectedFilters.includes(filter.id)
                            ? "bg-primary-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Material
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions
                    .filter((f) => ["metal", "plastic"].includes(f.id))
                    .map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => toggleFilter(filter.id)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                          selectedFilters.includes(filter.id)
                            ? "bg-primary-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Section */}
        <section className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="lg:hidden inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:border-primary-500 hover:text-primary-600"
              >
                <span>☰</span>
                Filters
                {selectedFilters.length > 0 && (
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-500 px-1.5 text-[10px] font-semibold text-white">
                    {selectedFilters.length}
                  </span>
                )}
              </button>
              <span className="text-sm font-medium text-slate-600">
                {hasResults
                  ? `${products.length} ${
                      products.length === 1 ? "product" : "products"
                    } found`
                  : "No products match the current selection yet."}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label
                htmlFor="sort"
                className="text-xs font-medium text-slate-600"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none ring-primary-200 transition-all hover:border-primary-300 focus:ring-2"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {isFiltersOpen && (
            <div className="lg:hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 animate-slide-up">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setIsFiltersOpen(false)}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => toggleFilter(filter.id)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                        selectedFilters.includes(filter.id)
                          ? "bg-primary-500 text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-80 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-sm text-red-700">
              {error}
            </div>
          ) : hasResults ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, idx) => (
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
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
              <div className="text-4xl">🔍</div>
              <div className="text-lg font-bold text-slate-900">
                {t("catalog.noResults")}
              </div>
              <p className="max-w-md text-sm text-slate-600">
                We couldn&apos;t find any {type} matching your current filters.
                Try adjusting your selection or browse all products.
              </p>
              {selectedFilters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFilters([])}
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CatalogPage;
