"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { PRODUCTS, type Slug, getUpsellSlug } from "@/content/products";
import { copy } from "@/content/copy";
import { mainTotal } from "@/lib/pricing";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";

const SLUGS: Slug[] = ["oud", "shafaq", "safa"];

export function CartDrawer() {
  const {
    lines, open, closeCart, openCheckout, checkoutOpen,
    addMain, removeMain, setMainQuantity,
  } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const mainLines = lines.filter((l) => l.pricing === "main");
  const mainUnits = mainLines.reduce((s, l) => s + l.quantity, 0);
  const total = mainTotal(mainUnits);
  const presentSlugs = new Set(mainLines.map((l) => l.slug));
  const missingSlugs = SLUGS.filter((s) => !presentSlugs.has(s));

  // Mount guard to prevent hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  // Focus trap
  useEffect(() => {
    if (open) {
      drawerRef.current?.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeCart]);

  if (!mounted || (!open && !checkoutOpen)) return null;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer from left (end side in RTL) */}
      {open && (
        <div
          ref={drawerRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={copy.cart.title}
          className="fixed inset-y-0 end-0 z-50 w-full max-w-[420px] bg-paper flex flex-col shadow-2xl outline-none"
          style={{ transition: "transform 200ms" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-line">
            <h2 className="text-xl font-bold text-ink">{copy.cart.title}</h2>
            <button
              onClick={closeCart}
              className="p-2 text-muted hover:text-ink"
              aria-label="إغلاق السلة"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
            {mainLines.length === 0 ? (
              <p className="text-muted text-center py-8">{copy.cart.emptyMsg}</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {mainLines.map((line) => {
                  const p = PRODUCTS[line.slug];
                  return (
                    <li key={line.slug} className="flex gap-3 items-start">
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-sand flex-shrink-0">
                        <Image src={p.imageSrcs[0]} alt={p.nameAr} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="font-bold text-ink text-sm">{p.nameAr}</span>
                        <span className="text-muted text-xs">{p.enemyAr}</span>
                        <span className="text-muted text-xs">{copy.cart.lineNote}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => setMainQuantity(line.slug, line.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-ink hover:bg-sand min-w-[28px]"
                            aria-label="تقليل"
                          >
                            –
                          </button>
                          <span className="text-sm font-bold w-5 text-center">{line.quantity}</span>
                          <button
                            onClick={() => setMainQuantity(line.slug, line.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-ink hover:bg-sand min-w-[28px]"
                            aria-label="زيادة"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeMain(line.slug)}
                            className="ms-auto text-muted text-xs hover:text-brand"
                            aria-label="حذف"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Ladder reminder */}
            {mainLines.length > 0 && (
              <LadderReminder units={mainUnits} />
            )}

            {/* Cross-sell */}
            {mainLines.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-ink mb-3">{copy.cart.crossSellTitle}</h3>
                {missingSlugs.length === 0 ? (
                  <p className="text-muted text-sm">{copy.cart.crossSellComplete}</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {missingSlugs.map((slug) => {
                      const p = PRODUCTS[slug];
                      return (
                        <div key={slug} className="flex items-center gap-3 bg-ivory rounded-[12px] p-3">
                          <div className="relative w-12 h-14 rounded-md overflow-hidden bg-sand flex-shrink-0">
                            <Image src={p.imageSrcs[0]} alt={p.nameAr} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-ink">{p.nameAr}</div>
                            <div className="text-muted text-xs">{p.enemyAr}</div>
                            <div className="text-brand font-bold text-sm mt-0.5">١٩٩ ر.س</div>
                          </div>
                          <button
                            onClick={() => addMain(slug, 1)}
                            className="bg-brand-deep text-on-brand px-3 py-1.5 rounded-full text-xs font-bold hover:opacity-90 min-h-[36px]"
                          >
                            {copy.cart.crossSellAdd}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-line p-5 flex flex-col gap-3">
            {/* Trust */}
            <div className="flex justify-center gap-4 text-muted text-xs flex-wrap">
              {copy.cart.trust.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>

            {/* Total */}
            {mainUnits > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-bold text-ink">{copy.cart.totalLabel}</span>
                <span className="font-bold text-ink text-lg">{total} {copy.cart.currency}</span>
              </div>
            )}

            {/* Checkout CTA */}
            <button
              onClick={() => { openCheckout(); closeCart(); }}
              disabled={mainUnits === 0}
              className="w-full bg-brand-deep text-on-brand py-4 rounded-full font-bold text-base disabled:opacity-40 hover:opacity-90 transition-opacity min-h-[52px]"
            >
              {copy.cart.checkoutCta}
            </button>
          </div>
        </div>
      )}

      {/* Checkout modal rendered here when open */}
      {checkoutOpen && <CheckoutModal />}
    </>
  );
}

function LadderReminder({ units }: { units: number }) {
  const tiers = [
    { count: 1, total: 199, label: "١" },
    { count: 2, total: 279, label: "٢" },
    { count: 3, total: 349, label: "٣" },
  ];
  return (
    <div className="bg-ivory rounded-[12px] p-3">
      <div className="flex justify-around text-xs text-center gap-2">
        {tiers.map((t) => (
          <div
            key={t.count}
            className={`flex flex-col gap-0.5 px-2 py-1.5 rounded-lg transition-colors ${
              units === t.count ? "border-2 border-brand text-brand" : "text-muted"
            }`}
          >
            <span className="font-bold">{t.count} قطعة</span>
            <span>{t.total} ر.س</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
