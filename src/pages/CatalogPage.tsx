import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useProducts } from "../hooks/useProducts";
import { useTranslation } from "../hooks/useTranslation";
import { useCatalogState } from "../hooks/useCatalogState";
import { GENDER_KEYS, SHAPE_KEYS, MATERIAL_KEYS } from "../config/filterMaps";

import type { ProductType } from "../types/product";

import {
  CatalogFiltersSidebar,
  CatalogSearchAndToolbar,
  CatalogMobileFilters,
  CatalogProductGrid,
} from "../components/catalog";
import Button from "../components/ui/Button";

type CatalogPageProps = {
  type: ProductType;
};

const CatalogPage = ({ type }: CatalogPageProps) => {
  const productsPerPage = 9;
  const { t } = useTranslation();
  const { products, isLoading, error } = useProducts(type);
  const [visibleCount, setVisibleCount] = useState(productsPerPage);
  const {
    selectedFilters,
    sortBy,
    setSortBy,
    isFiltersOpen,
    setIsFiltersOpen,
    searchQuery,
    setSearchQuery,
    filteredAndSortedProducts,
    toggleFilter,
    resetFilters,
    availableFilterOptions,
  } = useCatalogState(products);

  const paginatedProducts = useMemo(() => {
    return filteredAndSortedProducts.slice(0, visibleCount);
  }, [visibleCount, filteredAndSortedProducts]);

  useEffect(() => {
    resetFilters();
    setVisibleCount(productsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clear when catalog type changes
  }, [type]);

  useEffect(() => {
    setVisibleCount(productsPerPage);
  }, [searchQuery, sortBy, selectedFilters]);

  const title =
    type === "glasses"
      ? t("catalog.title.glasses")
      : t("catalog.title.sunglasses");
  const description =
    type === "glasses"
      ? t("catalog.description.glasses")
      : t("catalog.description.sunglasses");
  const intro =
    type === "glasses"
      ? t("catalog.intro.glasses")
      : t("catalog.intro.sunglasses");

  const filterLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    availableFilterOptions.genderIds.forEach((id) => {
      map[id] = t(GENDER_KEYS[id] ?? id);
    });
    availableFilterOptions.shapeIds.forEach((id) => {
      map[id] = t(SHAPE_KEYS[id] ?? id);
    });
    availableFilterOptions.materialIds.forEach((id) => {
      map[id] = t(MATERIAL_KEYS[id] ?? id);
    });
    return map;
  }, [availableFilterOptions, t]);

  return (
    <div className="space-y-8 pb-8">
      {/* Banner header */}
      <header className="rounded-2xl bg-gradient-to-br from-slate-50 via-white to-primary-50/30 border border-slate-100 px-5 py-6 md:px-8 md:py-8">
        <div className="grid md:grid-cols-[1fr,auto] gap-6 items-center">
          <div className="space-y-4">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
              <Link
                to="/"
                className="hover:text-primary-500 transition-colors duration-150"
              >
                {t("catalog.breadcrumb.home")}
              </Link>
              <span aria-hidden="true">›</span>
              <span className="font-medium text-slate-800">{title}</span>
            </nav>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {title}
            </h1>
            <p className="text-base text-slate-600 md:text-lg">{description}</p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              {intro}
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center w-28 h-28 rounded-full bg-primary-50 ring-1 ring-primary-100 shrink-0 text-6xl select-none" aria-hidden="true">
            {type === "glasses" ? "👓" : "🕶️"}
          </div>
        </div>
        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <CatalogFiltersSidebar
          selectedFilters={selectedFilters}
          onClearFilters={resetFilters}
          onToggleFilter={toggleFilter}
          availableFilterOptions={availableFilterOptions}
        />

        <section className="space-y-4">
          <CatalogSearchAndToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultCount={filteredAndSortedProducts.length}
            selectedFiltersCount={selectedFilters.length}
            isFiltersOpen={isFiltersOpen}
            onToggleFilters={() => setIsFiltersOpen((prev) => !prev)}
          />

          <CatalogMobileFilters
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            selectedFilters={selectedFilters}
            onToggleFilter={toggleFilter}
            availableFilterOptions={availableFilterOptions}
          />

          {/* Active filter chips */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              {selectedFilters.map((filterId) => (
                <button
                  key={filterId}
                  type="button"
                  onClick={() => toggleFilter(filterId)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors duration-150"
                >
                  {filterLabelMap[filterId] ?? filterId}
                  <span className="text-primary-400 hover:text-primary-600" aria-hidden="true">
                    ×
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors duration-150 underline underline-offset-2"
              >
                {t("catalog.filters.clearAll")}
              </button>
            </div>
          )}

          {/* Showing X of Y counter */}
          {!isLoading && !error && filteredAndSortedProducts.length > 0 && (
            <p className="text-xs text-slate-500">
              {t("catalog.showing")}{" "}
              <span className="font-semibold text-slate-700">
                {paginatedProducts.length}
              </span>{" "}
              {t("catalog.pagination.of")}{" "}
              <span className="font-semibold text-slate-700">
                {filteredAndSortedProducts.length}
              </span>{" "}
              {t("catalog.products")}
            </p>
          )}

          <CatalogProductGrid
            isLoading={isLoading}
            error={error}
            products={paginatedProducts}
            emptyTitle={t("catalog.noResults")}
            emptyDescription={t("catalog.noResultsDescription")}
            onClearFilters={resetFilters}
            onClearSearch={() => setSearchQuery("")}
            hasActiveFilters={selectedFilters.length > 0}
            hasSearchQuery={!!searchQuery.trim()}
          />

          {!isLoading &&
            !error &&
            paginatedProducts.length < filteredAndSortedProducts.length && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    setVisibleCount((prev) => prev + productsPerPage)
                  }
                  className="min-w-[200px] rounded-full border-2 border-primary-500/60 bg-white px-8 py-3.5 text-slate-700 shadow-sm transition-all duration-200 hover:border-primary-500 hover:bg-primary-50/50 hover:shadow-md hover:text-slate-900 focus:ring-primary-400"
                >
                  {t("common.loadMore") ?? "Load more"}
                </Button>
              </div>
            )}
        </section>
      </div>
    </div>
  );
};

export default CatalogPage;
