import { useState, useMemo } from "react";

import type { Product } from "../types/product";

export type SortOption = "price-low" | "price-high" | "newest" | "popular";

const FILTER_OPTIONS = [
  { id: "men", labelKey: "men" },
  { id: "women", labelKey: "women" },
  { id: "kids", labelKey: "kids" },
  { id: "round", labelKey: "round" },
  { id: "square", labelKey: "square" },
  { id: "cat-eye", labelKey: "catEye" },
  { id: "metal", labelKey: "metal" },
  { id: "plastic", labelKey: "plastic" },
] as const;

export function useCatalogState(products: Product[]) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter((product) => {
        const genderMatch =
          (selectedFilters.includes("men") && product.gender === "men") ||
          (selectedFilters.includes("women") && product.gender === "women") ||
          (selectedFilters.includes("kids") && product.gender === "kids");
        const shapeMatch =
          (selectedFilters.includes("round") && product.frameShape === "round") ||
          (selectedFilters.includes("square") &&
            product.frameShape === "square") ||
          (selectedFilters.includes("cat-eye") &&
            product.frameShape === "cat-eye");
        const materialMatch =
          (selectedFilters.includes("metal") &&
            product.frameMaterial === "metal") ||
          (selectedFilters.includes("plastic") &&
            product.frameMaterial === "plastic");

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

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  return {
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
    filterOptions: FILTER_OPTIONS,
  };
}
