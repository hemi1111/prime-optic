import { useTranslation } from "../../hooks/useTranslation";

import type { SortOption } from "../../hooks/useCatalogState";

type CatalogSearchAndToolbarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  resultCount: number;
  selectedFiltersCount: number;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
};

export function CatalogSearchAndToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  resultCount,
  selectedFiltersCount,
  isFiltersOpen,
  onToggleFilters,
}: CatalogSearchAndToolbarProps) {
  const { t } = useTranslation();

  return (
    <>
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleFilters}
            className="lg:hidden inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:border-primary-500 hover:text-primary-600"
          >
            <span>☰</span>
            {t("catalog.filters")}
            {selectedFiltersCount > 0 && (
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-500 px-1.5 text-[10px] font-semibold text-white">
                {selectedFiltersCount}
              </span>
            )}
          </button>
          <span className="text-sm font-medium text-slate-600">
            {resultCount > 0
              ? `${resultCount} ${
                  resultCount === 1
                    ? t("catalog.product")
                    : t("catalog.products")
                } ${t("catalog.productsFound")}`
              : t("catalog.noMatch")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label
            htmlFor="catalog-sort"
            className="text-xs font-medium text-slate-600"
          >
            {t("catalog.sortBy")}
          </label>
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none ring-primary-200 transition-all hover:border-primary-300 focus:ring-2"
          >
            <option value="newest">{t("catalog.sort.newest")}</option>
            <option value="price-low">{t("catalog.sort.priceLow")}</option>
            <option value="price-high">{t("catalog.sort.priceHigh")}</option>
            <option value="popular">{t("catalog.sort.popular")}</option>
          </select>
        </div>
      </div>
    </>
  );
}
