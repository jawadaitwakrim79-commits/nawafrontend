/**
 * Zustand cart store, persisted to localStorage "nawa-cart".
 */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Slug } from "@/content/products";
import { mainTotal } from "@/lib/pricing";

export interface CartLine {
  slug: Slug;
  quantity: number;
  pricing: "main" | "upsell";
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  checkoutOpen: boolean;
  upsellOpen: boolean;

  // Computed
  mainUnits: () => number;
  total: () => number;

  // Actions
  addMain: (slug: Slug, quantity?: number) => void;
  removeMain: (slug: Slug) => void;
  setMainQuantity: (slug: Slug, quantity: number) => void;
  setUpsell: (slug: Slug | null) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openUpsell: () => void;
  closeUpsell: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      checkoutOpen: false,
      upsellOpen: false,

      mainUnits: () => {
        const { lines } = get();
        return lines
          .filter((l) => l.pricing === "main")
          .reduce((sum, l) => sum + l.quantity, 0);
      },

      total: () => {
        const { lines } = get();
        const mainUnits = lines
          .filter((l) => l.pricing === "main")
          .reduce((sum, l) => sum + l.quantity, 0);
        const upsellUnits = lines.filter((l) => l.pricing === "upsell").length > 0 ? 1 : 0;
        return mainTotal(mainUnits) + 99 * upsellUnits;
      },

      addMain: (slug, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.slug === slug && l.pricing === "main"
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.slug === slug && l.pricing === "main"
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              ),
              open: true,
            };
          }
          return {
            lines: [...state.lines, { slug, quantity, pricing: "main" }],
            open: true,
          };
        }),

      removeMain: (slug) =>
        set((state) => ({
          lines: state.lines.filter(
            (l) => !(l.slug === slug && l.pricing === "main")
          ),
        })),

      setMainQuantity: (slug, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter(
                  (l) => !(l.slug === slug && l.pricing === "main")
                )
              : state.lines.map((l) =>
                  l.slug === slug && l.pricing === "main"
                    ? { ...l, quantity }
                    : l
                ),
        })),

      setUpsell: (slug) =>
        set((state) => {
          const withoutUpsell = state.lines.filter((l) => l.pricing !== "upsell");
          if (!slug) return { lines: withoutUpsell };
          return {
            lines: [...withoutUpsell, { slug, quantity: 1, pricing: "upsell" }],
          };
        }),

      clearCart: () =>
        set({ lines: [], open: false, checkoutOpen: false, upsellOpen: false }),

      openCart: () => set({ open: true }),
      closeCart: () => set({ open: false }),
      openCheckout: () => set({ checkoutOpen: true }),
      closeCheckout: () => set({ checkoutOpen: false }),
      openUpsell: () => set({ upsellOpen: true }),
      closeUpsell: () => set({ upsellOpen: false }),
    }),
    {
      name: "nawa-cart",
      partialize: (state) => ({ lines: state.lines }),
    }
  )
);
