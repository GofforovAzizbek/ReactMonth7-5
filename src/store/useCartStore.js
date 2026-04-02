import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "nike_cart_v1";

const toCartItem = (product, size) => ({
  id: product.id,
  name: product.name,
  price: Number(product.price || 0),
  image: product.image,
  category: product.category,
  size,
  quantity: 1,
});

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (product, size) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.id === product.id && item.size === size,
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, toCartItem(product, size)],
          };
        }),
      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.size === size)),
        })),
      updateQuantity: (id, size, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => !(item.id === id && item.size === size),
              ),
            };
          }

          return {
            items: state.items.map((item) =>
              item.id === id && item.size === size ? { ...item, quantity } : item,
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
