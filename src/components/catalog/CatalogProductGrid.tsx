import type { Product } from "../../types/product";
import { AnimatePresence, motion } from "framer-motion";
import {
  listContainerVariants,
  listItemVariants,
  stateSwapVariants,
} from "../../config/motion";

import ProductCard from "../ProductCard";

import Button from "../ui/Button";

type CatalogProductGridProps = {
  isLoading: boolean;
  error: string | null;
  products: Product[];
  emptyTitle: string;
  emptyDescription: string;
  onClearFilters?: () => void;
  onClearSearch?: () => void;
  hasActiveFilters: boolean;
  hasSearchQuery: boolean;
  clearFiltersLabel?: string;
  clearSearchLabel?: string;
  backToHomeLink?: { to: string; label: string };
};

const CatalogProductGrid = ({
  isLoading,
  error,
  products,
  emptyTitle,
  emptyDescription,
  onClearFilters,
  onClearSearch,
  hasActiveFilters,
  hasSearchQuery,
  clearFiltersLabel = "Clear filters",
  clearSearchLabel = "Clear search",
  backToHomeLink,
}: CatalogProductGridProps) => {
  const hasResults = products.length > 0;
  const showEmptyActions =
    (hasActiveFilters || hasSearchQuery) && (onClearFilters || onClearSearch);
  const stateKey = isLoading
    ? "loading"
    : error
      ? "error"
      : hasResults
        ? "content"
        : "empty";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stateKey}
        variants={stateSwapVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {isLoading ? (
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100 min-w-0"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : !hasResults ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
            <div className="text-4xl">🔍</div>
            <div className="text-lg font-bold text-slate-900">{emptyTitle}</div>
            <p className="max-w-md text-sm text-slate-600">{emptyDescription}</p>
            {showEmptyActions && (
              <div className="flex gap-2 mt-2">
                {hasActiveFilters && onClearFilters && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onClearFilters}
                  >
                    {clearFiltersLabel}
                  </Button>
                )}
                {hasSearchQuery && onClearSearch && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onClearSearch}
                  >
                    {clearSearchLabel}
                  </Button>
                )}
              </div>
            )}
            {backToHomeLink && (
              <Button
                to={backToHomeLink.to}
                variant="primary"
                size="sm"
                className="mt-4"
              >
                {backToHomeLink.label}
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            variants={listContainerVariants}
            initial="initial"
            animate="animate"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={listItemVariants}
                className="min-w-0"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CatalogProductGrid;
