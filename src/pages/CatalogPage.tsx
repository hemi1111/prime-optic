import { useEffect, useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useTranslation } from "../hooks/useTranslation";
import { useCatalogState } from "../hooks/useCatalogState";

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

  return (
    <div className="space-y-8 pb-8">
      <header className="rounded-2xl bg-gradient-to-br from-slate-50 via-white to-primary-50/30 border border-slate-100 px-5 py-6 md:px-8 md:py-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h1>
        <p className="text-base text-slate-600 md:text-lg">{description}</p>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
          {intro}
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <CatalogFiltersSidebar
          selectedFilters={selectedFilters}
          onClearFilters={resetFilters}
          onToggleFilter={toggleFilter}
          availableFilterOptions={availableFilterOptions}
        />

        <section className="space-y-6">
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

          <CatalogProductGrid
            isLoading={isLoading}
            error={error}
            products={paginatedProducts}
            emptyTitle={t("catalog.noResults")}
            emptyDescription={`We couldn't find any ${type} matching your current ${
              searchQuery ? "search" : "filters"
            }. Try adjusting your ${
              searchQuery ? "search term" : "selection"
            } or browse all products.`}
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
