import { useState, useMemo } from "react";

import { useProducts } from "../hooks/useProducts";
import { useTranslation } from "../hooks/useTranslation";

import type { ProductType } from "../types/product";

import ProductCard from "../components/ProductCard";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and search logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter((product) => {
        const genderMatch =
          (selectedFilters.includes("men") && product.gender === "men") ||
          (selectedFilters.includes("women") && product.gender === "women") ||
          (selectedFilters.includes("kids") && product.gender === "kids");

        const shapeMatch =
          (selectedFilters.includes("round") &&
            product.frameShape === "round") ||
          (selectedFilters.includes("square") &&
            product.frameShape === "square") ||
          (selectedFilters.includes("cat-eye") &&
            product.frameShape === "cat-eye");

        const materialMatch =
          (selectedFilters.includes("metal") &&
            product.frameMaterial === "metal") ||
          (selectedFilters.includes("plastic") &&
            product.frameMaterial === "plastic");

        // If no filters from a category are selected, consider it a match
        const genderFilters = ["men", "women", "kids"].filter((f) =>
          selectedFilters.includes(f)
        );
        const shapeFilters = ["round", "square", "cat-eye"].filter((f) =>
          selectedFilters.includes(f)
        );
        const materialFilters = ["metal", "plastic"].filter((f) =>
          selectedFilters.includes(f)
        );

        const genderOk = genderFilters.length === 0 || genderMatch;
        const shapeOk = shapeFilters.length === 0 || shapeMatch;
        const materialOk = materialFilters.length === 0 || materialMatch;

        return genderOk && shapeOk && materialOk;
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "popular":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, selectedFilters, sortBy, searchQuery]);

  const title =
    type === "glasses"
      ? t("catalog.title.glasses")
      : t("catalog.title.sunglasses");
  const description =
    type === "glasses"
      ? t("catalog.description.glasses")
      : t("catalog.description.sunglasses");

  const hasResults = filteredAndSortedProducts.length > 0;

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
        <p className="text-base text-slate-600 md:text-lg">{description}</p>
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
                  {t("catalog.filters.clearAll")}
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t("catalog.filters.gender")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "men", label: t("catalog.filters.men") },
                    { id: "women", label: t("catalog.filters.women") },
                    { id: "kids", label: t("catalog.filters.kids") },
                  ].map((filter) => (
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
                  {t("catalog.filters.frameShape")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "round", label: t("catalog.filters.round") },
                    { id: "square", label: t("catalog.filters.square") },
                    { id: "cat-eye", label: t("catalog.filters.catEye") },
                  ].map((filter) => (
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
                  {t("catalog.filters.material")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "metal", label: t("catalog.filters.metal") },
                    { id: "plastic", label: t("catalog.filters.plastic") },
                  ].map((filter) => (
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
          {/* Search Bar */}
          <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder={
                  t("catalog.search.placeholder") || "Search products..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="lg:hidden inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:border-primary-500 hover:text-primary-600"
              >
                <span>☰</span>
                {t("catalog.filters")}
                {selectedFilters.length > 0 && (
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-500 px-1.5 text-[10px] font-semibold text-white">
                    {selectedFilters.length}
                  </span>
                )}
              </button>
              <span className="text-sm font-medium text-slate-600">
                {hasResults
                  ? `${filteredAndSortedProducts.length} ${
                      filteredAndSortedProducts.length === 1
                        ? t("catalog.product")
                        : t("catalog.products")
                    } ${t("catalog.productsFound")}`
                  : t("catalog.noMatch")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label
                htmlFor="sort"
                className="text-xs font-medium text-slate-600"
              >
                {t("catalog.sortBy")}
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none ring-primary-200 transition-all hover:border-primary-300 focus:ring-2"
              >
                <option value="newest">{t("catalog.sort.newest")}</option>
                <option value="price-low">{t("catalog.sort.priceLow")}</option>
                <option value="price-high">
                  {t("catalog.sort.priceHigh")}
                </option>
                <option value="popular">{t("catalog.sort.popular")}</option>
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
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedProducts.map((product, idx) => (
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
                We couldn&apos;t find any {type} matching your current{" "}
                {searchQuery ? "search" : "filters"}. Try adjusting your{" "}
                {searchQuery ? "search term" : "selection"} or browse all
                products.
              </p>
              {(selectedFilters.length > 0 || searchQuery) && (
                <div className="flex gap-2 mt-2">
                  {selectedFilters.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedFilters([])}
                      className="inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600"
                    >
                      Clear filters
                    </button>
                  )}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="inline-flex items-center justify-center rounded-full bg-slate-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CatalogPage;
