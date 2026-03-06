import { useEffect } from "react";
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

type CatalogPageProps = {
  type: ProductType;
};

const CatalogPage = ({ type }: CatalogPageProps) => {
  const { t } = useTranslation();
  const { products, isLoading, error } = useProducts(type);
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

  useEffect(() => {
    resetFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clear when catalog type changes
  }, [type]);

  const title =
    type === "glasses"
      ? t("catalog.title.glasses")
      : t("catalog.title.sunglasses");
  const description =
    type === "glasses"
      ? t("catalog.description.glasses")
      : t("catalog.description.sunglasses");

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h1>
        <p className="text-base text-slate-600 md:text-lg">{description}</p>
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
            products={filteredAndSortedProducts}
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
        </section>
      </div>
    </div>
  );
};

export default CatalogPage;
