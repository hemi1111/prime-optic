import { useState, useMemo } from "react";

import type { Product } from "../types/product";

export type SortOption = "price-low" | "price-high" | "newest" | "popular";

export function useCatalogState(products: Product[]) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          (p.name?.toLowerCase().includes(query) ?? false) ||
          (p.brand?.toLowerCase().includes(query) ?? false) ||
          (p.description?.toLowerCase().includes(query) ?? false)
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
          (selectedFilters.includes("square") && product.frameShape === "square") ||
          (selectedFilters.includes("cat-eye") && product.frameShape === "cat-eye") ||
          (selectedFilters.includes("oval") && product.frameShape === "oval") ||
          (selectedFilters.includes("aviator") && product.frameShape === "aviator") ||
          (selectedFilters.includes("rectangular") && product.frameShape === "rectangular") ||
          (selectedFilters.includes("oversized") && product.frameShape === "oversized") ||
          (selectedFilters.includes("pilot") && product.frameShape === "pilot") ||
          (selectedFilters.includes("rounded square") && product.frameShape === "rounded square") ||
          (selectedFilters.includes("wrapped") && product.frameShape === "wrapped") ||
          (selectedFilters.includes("sport") && product.frameShape === "sport") ||
          (selectedFilters.includes("browline") && product.frameShape === "browline");
        const materialMatch =
          (selectedFilters.includes("metal") && product.frameMaterial === "metal") ||
          (selectedFilters.includes("plastic") && product.frameMaterial === "plastic") ||
          (selectedFilters.includes("acetate") && product.frameMaterial === "acetate") ||
          (selectedFilters.includes("titanium") && product.frameMaterial === "titanium") ||
          (selectedFilters.includes("mixed") && product.frameMaterial === "mixed") ||
          (selectedFilters.includes("nylon") && product.frameMaterial === "nylon") ||
          (selectedFilters.includes("carbon fiber") && product.frameMaterial === "carbon fiber") ||
          (selectedFilters.includes("TR90") && product.frameMaterial === "TR90") ||
          (selectedFilters.includes("recycled acetate") && product.frameMaterial === "recycled acetate") ||
          (selectedFilters.includes("acetate/metal") && product.frameMaterial === "acetate/metal");

        const genderFilters = ["men", "women", "kids"].filter((f) =>
          selectedFilters.includes(f)
        );
        const shapeFilters = ["round", "square", "cat-eye", "oval", "aviator", "rectangular", "oversized", "pilot", "rounded square", "wrapped", "sport", "browline"].filter((f) =>
          selectedFilters.includes(f)
        );
        const materialFilters = ["metal", "plastic", "acetate", "titanium", "mixed", "nylon", "carbon fiber", "TR90", "recycled acetate", "acetate/metal"].filter((f) =>
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
  };
}
