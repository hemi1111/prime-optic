import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "../types/product";

interface FavoritesState {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  getFavoritesCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addToFavorites: (product: Product) => {
        set((state) => ({
          favorites: state.favorites.some((fav) => fav.id === product.id)
            ? state.favorites
            : [...state.favorites, product],
        }));
      },

      removeFromFavorites: (productId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== productId),
        }));
      },

      isFavorite: (productId: string) => {
        return get().favorites.some((fav) => fav.id === productId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      getFavoritesCount: () => {
        return get().favorites.length;
      },
    }),
    {
      name: "favorites-storage",
    },
  ),
);
