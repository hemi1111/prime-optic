import { useParams } from "react-router-dom";

import { useProductsByBrand } from "../hooks/useProducts";
import { useTranslation } from "../hooks/useTranslation";
import { useCatalogState } from "../hooks/useCatalogState";
import { getBrandBySlug } from "../config/brands";

import Button from "../components/ui/Button";
import {
  CatalogFiltersSidebar,
  CatalogSearchAndToolbar,
  CatalogMobileFilters,
  CatalogProductGrid,
} from "../components/catalog";

const BrandCatalogPage = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const { t } = useTranslation();
  const brand = brandSlug ? getBrandBySlug(brandSlug) : undefined;
  const { products, isLoading, error } = useProductsByBrand(brandSlug);
  const {
    selectedFilters,
    setSelectedFilters,
    sortBy,
    setSortBy,
    isFiltersOpen,
    setIsFiltersOpen,
    searchQuery,
    setSearchQuery,
    filteredAndSortedProducts,
    toggleFilter,
    filterOptions,
  } = useCatalogState(products);

  if (brandSlug && !brand) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
        <div className="text-4xl">🔍</div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t("brand.notFound")}
        </h1>
        <p className="max-w-md text-sm text-slate-600">
          {t("brand.notFoundDescription")}
        </p>
        <Button to="/" variant="primary" size="lg">
          {t("brand.backToHome")}
        </Button>
      </div>
    );
  }

  const title = brand
    ? t("brand.title", { brand: brand.name })
    : t("catalog.title.glasses");
  const description = brand
    ? t("brand.description", { brand: brand.name })
    : "";

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-base text-slate-600 md:text-lg">{description}</p>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <CatalogFiltersSidebar
          selectedFilters={selectedFilters}
          onClearFilters={() => setSelectedFilters([])}
          onToggleFilter={toggleFilter}
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
            filterOptions={filterOptions}
          />

          <CatalogProductGrid
            isLoading={isLoading}
            error={error}
            products={filteredAndSortedProducts}
            emptyTitle={t("brand.noProducts")}
            emptyDescription={t("brand.noProductsDescription")}
            onClearFilters={() => setSelectedFilters([])}
            onClearSearch={() => setSearchQuery("")}
            hasActiveFilters={selectedFilters.length > 0}
            hasSearchQuery={!!searchQuery.trim()}
            clearFiltersLabel={t("catalog.filters.clearAll")}
            backToHomeLink={{ to: "/", label: t("brand.backToHome") }}
          />
        </section>
      </div>
    </div>
  );
};

export default BrandCatalogPage;
