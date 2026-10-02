"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { PRODUCTS, type Slug } from "@/content/products";
import { copy } from "@/content/copy";
import { mainTotal } from "@/lib/pricing";
import { trackAddToCart, trackViewContent } from "@/lib/tracking";
import { sendEvent } from "@/lib/api";
import { useEffect } from "react";

const OFFER_OPTIONS = copy.pdp.offerOptions;

export function PDPHero({ slug }: { slug: Slug }) {
  const product = PRODUCTS[slug];
  const [selectedIdx, setSelectedIdx] = useState(1); // default to قطعتان
  const [activeImg, setActiveImg] = useState(0);
  const addMain = useCartStore((s) => s.addMain);
  const openCart = useCartStore((s) => s.openCart);

  const selectedOption = OFFER_OPTIONS[selectedIdx];
  const total = mainTotal(selectedOption.quantity);

  // ViewContent on mount
  useEffect(() => {
    const eid = crypto.randomUUID();
    trackViewContent(eid, { value: 199, contentIds: [slug], numItems: 1 });
    void sendEvent({ event_name: "ViewContent", event_id: eid, value: 199, content_ids: [slug] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAdd() {
    addMain(slug, selectedOption.quantity);
    openCart();
    const eid = crypto.randomUUID();
    trackAddToCart(eid, {
      value: total,
      contentIds: [slug],
      numItems: selectedOption.quantity,
    });
    void sendEvent({
      event_name: "AddToCart",
      event_id: eid,
      value: total,
      content_ids: [slug],
    });
  }

  return (
    <div className="band max-w-[1120px] mx-auto px-5 py-12">
      {/* Gallery */}
      <div className="media flex flex-col gap-3">
        <div className="relative rounded-[20px] overflow-hidden bg-sand" style={{ aspectRatio: "4/5" }}>
          <Image
            src={product.imageSrcs[activeImg]}
            alt={`${product.nameAr} - صورة ${activeImg + 1}`}
            fill
            className="object-cover"
            priority={activeImg === 0}
            sizes="(max-width: 1023px) 100vw, 560px"
          />
        </div>
        <div className="flex gap-2">
          {product.imageSrcs.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveImg(i)}
              className={`relative w-16 h-20 rounded-lg overflow-hidden bg-sand border-2 transition-colors ${
                i === activeImg ? "border-brand" : "border-transparent"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Copy */}
      <div className="copy flex flex-col gap-5 justify-center">
        <div>
          <h1 className="text-ink">{product.nameAr}</h1>
          <p className="text-muted text-lg mt-1">{product.enemyAr}</p>
          <div className="stars mt-2">★★★★★</div>
        </div>

        <div>
          <div className="text-ink font-bold text-3xl">{copy.pdp.priceLine}</div>
          <p className="text-muted text-sm mt-1">{copy.pdp.ladderHint}</p>
        </div>

        {/* Offer picker */}
        <div className="flex flex-col gap-3">
          {OFFER_OPTIONS.map((opt, i) => (
            <button
              key={opt.quantity}
              onClick={() => setSelectedIdx(i)}
              className={`flex justify-between items-center px-5 py-3 rounded-[12px] border-2 transition-all ${
                i === selectedIdx
                  ? "border-brand bg-ivory"
                  : "border-line bg-paper hover:border-brand/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-ink">{opt.label}</span>
                {("badge" in opt) && opt.badge && (
                  <span className="text-xs font-bold bg-brand text-on-brand px-2 py-0.5 rounded-full">
                    {opt.badge}
                  </span>
                )}
              </div>
              <span className="font-bold text-ink">{opt.price}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-brand-deep text-on-brand py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity min-h-[56px]"
        >
          {copy.pdp.addCta}
        </button>

        {/* COD/Trust row */}
        <div className="flex flex-wrap gap-3">
          {copy.pdp.codRow.map((item) => (
            <span key={item} className="text-muted text-sm bg-ivory px-3 py-1.5 rounded-full">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
