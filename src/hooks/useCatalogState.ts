import { useState, useMemo } from "react";

import type { Product } from "../types/product";

export type SortOption = "price-low" | "price-high" | "newest" | "popular";

const GENDER_IDS = ["men", "women", "kids", "unisex"] as const;
const SHAPE_IDS = [
  "round", "square", "cat-eye", "oval", "aviator", "rectangular",
  "oversized", "pilot", "rounded square", "wrapped", "sport", "browline",
] as const;
const MATERIAL_IDS = [
  "metal", "plastic", "acetate", "titanium", "mixed", "nylon",
  "carbon fiber", "TR90", "recycled acetate", "acetate/metal",
] as const;

export type AvailableFilterOptions = {
  genderIds: string[];
  shapeIds: string[];
  materialIds: string[];
};

function getAvailableFilterOptions(products: Product[]): AvailableFilterOptions {
  const genderSet = new Set<string>();
  const shapeSet = new Set<string>();
  const materialSet = new Set<string>();
  for (const p of products) {
    if (p.gender && GENDER_IDS.includes(p.gender as typeof GENDER_IDS[number])) {
      genderSet.add(p.gender);
    }
    if (p.frameShape) shapeSet.add(p.frameShape);
    if (p.frameMaterial) materialSet.add(p.frameMaterial);
  }
  return {
    genderIds: GENDER_IDS.filter((id) => genderSet.has(id)),
    shapeIds: SHAPE_IDS.filter((id) => shapeSet.has(id)),
    materialIds: MATERIAL_IDS.filter((id) => materialSet.has(id)),
  };
}

export function useCatalogState(products: Product[]) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const availableFilterOptions = useMemo(
    () => getAvailableFilterOptions(products),
    [products]
  );

  const selectedFiltersSanitized = useMemo(() => {
    const { genderIds, shapeIds, materialIds } = availableFilterOptions;
    return selectedFilters.filter(
      (id) =>
        genderIds.includes(id) ||
        shapeIds.includes(id) ||
        materialIds.includes(id)
    );
  }, [selectedFilters, availableFilterOptions]);

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

    if (selectedFiltersSanitized.length > 0) {
      filtered = filtered.filter((product) => {
        const genderMatch =
          (selectedFiltersSanitized.includes("men") && product.gender === "men") ||
          (selectedFiltersSanitized.includes("women") && product.gender === "women") ||
          (selectedFiltersSanitized.includes("kids") && product.gender === "kids") ||
          (selectedFiltersSanitized.includes("unisex") && product.gender === "unisex");
        const shapeMatch =
          (selectedFiltersSanitized.includes("round") && product.frameShape === "round") ||
          (selectedFiltersSanitized.includes("square") && product.frameShape === "square") ||
          (selectedFiltersSanitized.includes("cat-eye") && product.frameShape === "cat-eye") ||
          (selectedFiltersSanitized.includes("oval") && product.frameShape === "oval") ||
          (selectedFiltersSanitized.includes("aviator") && product.frameShape === "aviator") ||
          (selectedFiltersSanitized.includes("rectangular") && product.frameShape === "rectangular") ||
          (selectedFiltersSanitized.includes("oversized") && product.frameShape === "oversized") ||
          (selectedFiltersSanitized.includes("pilot") && product.frameShape === "pilot") ||
          (selectedFiltersSanitized.includes("rounded square") && product.frameShape === "rounded square") ||
          (selectedFiltersSanitized.includes("wrapped") && product.frameShape === "wrapped") ||
          (selectedFiltersSanitized.includes("sport") && product.frameShape === "sport") ||
          (selectedFiltersSanitized.includes("browline") && product.frameShape === "browline");
        const materialMatch =
          (selectedFiltersSanitized.includes("metal") && product.frameMaterial === "metal") ||
          (selectedFiltersSanitized.includes("plastic") && product.frameMaterial === "plastic") ||
          (selectedFiltersSanitized.includes("acetate") && product.frameMaterial === "acetate") ||
          (selectedFiltersSanitized.includes("titanium") && product.frameMaterial === "titanium") ||
          (selectedFiltersSanitized.includes("mixed") && product.frameMaterial === "mixed") ||
          (selectedFiltersSanitized.includes("nylon") && product.frameMaterial === "nylon") ||
          (selectedFiltersSanitized.includes("carbon fiber") && product.frameMaterial === "carbon fiber") ||
          (selectedFiltersSanitized.includes("TR90") && product.frameMaterial === "TR90") ||
          (selectedFiltersSanitized.includes("recycled acetate") && product.frameMaterial === "recycled acetate") ||
          (selectedFiltersSanitized.includes("acetate/metal") && product.frameMaterial === "acetate/metal");

        const genderFilters = ["men", "women", "kids", "unisex"].filter((f) =>
          selectedFiltersSanitized.includes(f)
        );
        const shapeFilters = ["round", "square", "cat-eye", "oval", "aviator", "rectangular", "oversized", "pilot", "rounded square", "wrapped", "sport", "browline"].filter((f) =>
          selectedFiltersSanitized.includes(f)
        );
        const materialFilters = ["metal", "plastic", "acetate", "titanium", "mixed", "nylon", "carbon fiber", "TR90", "recycled acetate", "acetate/metal"].filter((f) =>
          selectedFiltersSanitized.includes(f)
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
  }, [products, selectedFiltersSanitized, sortBy, searchQuery]);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const resetFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
  };

  return {
    selectedFilters: selectedFiltersSanitized,
    setSelectedFilters,
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
  };
}
