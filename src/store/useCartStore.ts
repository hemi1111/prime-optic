import { create } from "zustand";
import { type CartItem } from "../types/product";

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, filterVariant?: boolean) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    filterVariant?: boolean
  ) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item, quantity = 1) =>
    set((state) => {
      const itemKey = item.addBlueLightFilter
        ? `${item.id}-bluefilter`
        : item.id;
      const existing = state.items.find((i) => {
        const existingKey = i.addBlueLightFilter ? `${i.id}-bluefilter` : i.id;
        return existingKey === itemKey;
      });

      if (existing) {
        return {
          items: state.items.map((i) => {
            const existingKey = i.addBlueLightFilter
              ? `${i.id}-bluefilter`
              : i.id;
            return existingKey === itemKey
              ? { ...i, quantity: i.quantity + quantity }
              : i;
          }),
        };
      }
      return {
        items: [...state.items, { ...item, quantity }],
      };
    }),
  removeItem: (id, filterVariant = false) =>
    set((state) => ({
      items: state.items.filter((item) => {
        const itemKey = item.addBlueLightFilter
          ? `${item.id}-bluefilter`
          : item.id;
        const targetKey = filterVariant ? `${id}-bluefilter` : id;
        return itemKey !== targetKey;
      }),
    })),
  updateQuantity: (id, quantity, filterVariant = false) =>
    set((state) => ({
      items: state.items.map((item) => {
        const itemKey = item.addBlueLightFilter
          ? `${item.id}-bluefilter`
          : item.id;
        const targetKey = filterVariant ? `${id}-bluefilter` : id;
        return itemKey === targetKey ? { ...item, quantity } : item;
      }),
    })),
  clear: () => set({ items: [] }),
}));
