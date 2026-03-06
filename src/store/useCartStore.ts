import { create } from "zustand";
import { type CartItem } from "../types/product";

function getCartItemKey(item: {
  id: string;
  addBlueLightFilter?: boolean;
  selectedColorName?: string;
}): string {
  const colorPart = item.selectedColorName ?? "";
  const filterPart = item.addBlueLightFilter ? "-bluefilter" : "";
  return `${item.id}${filterPart}${colorPart ? `-${colorPart}` : ""}`;
}

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (
    id: string,
    filterVariant?: boolean,
    selectedColorName?: string
  ) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    filterVariant?: boolean,
    selectedColorName?: string
  ) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item, quantity = 1) =>
    set((state) => {
      const itemKey = getCartItemKey(item);
      const existing = state.items.find(
        (i) => getCartItemKey(i) === itemKey
      );

      if (existing) {
        return {
          items: state.items.map((i) =>
            getCartItemKey(i) === itemKey
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { ...item, quantity }],
      };
    }),
  removeItem: (id, filterVariant = false, selectedColorName) =>
    set((state) => ({
      items: state.items.filter((item) => {
        const targetKey = getCartItemKey({
          id,
          addBlueLightFilter: filterVariant,
          selectedColorName,
        });
        return getCartItemKey(item) !== targetKey;
      }),
    })),
  updateQuantity: (id, quantity, filterVariant = false, selectedColorName) =>
    set((state) => ({
      items: state.items.map((item) => {
        const targetKey = getCartItemKey({
          id,
          addBlueLightFilter: filterVariant,
          selectedColorName,
        });
        return getCartItemKey(item) === targetKey ? { ...item, quantity } : item;
      }),
    })),
  clear: () => set({ items: [] }),
}));
