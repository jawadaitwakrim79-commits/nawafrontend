"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { copy } from "@/content/copy";
import type { Slug } from "@/content/products";

interface OfferOption {
  label: string;
  price: string;
  units: number;
  badge?: string;
}

interface OfferPickerProps {
  slug: Slug;
  options: OfferOption[];
  defaultUnits?: number;
}

export function OfferPicker({ slug, options, defaultUnits = 2 }: OfferPickerProps) {
  const [selected, setSelected] = useState(defaultUnits);
  const addMain = useCartStore((s) => s.addMain);
  const openCart = useCartStore((s) => s.openCart);

  const selectedOpt = options.find((o) => o.units === selected) ?? options[0];

  const handleAdd = () => {
    const store = useCartStore.getState();
    const existing = store.lines.find((l) => l.slug === slug && l.pricing === "main");
    if (existing) {
      store.setMainQuantity(slug, selected);
      store.openCart();
    } else {
      addMain(slug, selected);
      openCart();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.units}
            onClick={() => setSelected(opt.units)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-right ${
              selected === opt.units
                ? "border-brand bg-brand/5"
                : "border-line bg-white hover:border-brand/40"
            }`}
          >
            <span className="text-[17px] font-bold text-ink">{opt.price}</span>
            <div className="flex items-center gap-2">
              {opt.badge && (
                <span className="text-[11px] bg-brand text-on-brand px-2 py-0.5 rounded-full font-medium">
                  {opt.badge}
                </span>
              )}
              <span className="text-[15px] text-ink">{opt.label}</span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-[12px] text-muted text-center">{copy.pdp.ladderHint}</p>
      <button
        onClick={handleAdd}
        className="w-full bg-brand-deep text-on-brand py-4 rounded-full text-[17px] font-semibold hover:opacity-90 transition-opacity"
      >
        {copy.pdp.addCta}
      </button>
      <div className="flex justify-center gap-4 flex-wrap pt-1">
        {copy.pdp.codRow.map((g) => (
          <span key={g} className="text-[12px] text-muted flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {g}
          </span>
        ))}
      </div>
      {/* use selectedOpt to avoid unused warning */}
      {selectedOpt && null}
    </div>
  );
}
