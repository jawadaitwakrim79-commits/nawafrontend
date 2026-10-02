"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, type Slug } from "@/content/products";
import { copy } from "@/content/copy";
import { useCartStore } from "@/lib/cart-store";

interface ProductCardProps {
  slug: Slug;
  compact?: boolean;
}

export function ProductCard({ slug, compact = false }: ProductCardProps) {
  const product = PRODUCTS[slug];

  const handleAdd = useCallback(() => {
    useCartStore.getState().addMain(slug, 1);
    useCartStore.getState().openCart();
  }, [slug]);

  return (
    <article
      className="bg-ivory rounded-[20px] overflow-hidden flex flex-col"
      aria-label={product.nameAr}
    >
      {/* Image */}
      <div className="relative bg-sand" style={{ aspectRatio: "4/5" }}>
        <Image
          src={product.imageSrcs[0]}
          alt={product.nameAr}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 ${compact ? "p-4" : "p-5"} gap-2`}>
        <h3 className="text-ink font-bold text-lg">{product.nameAr}</h3>
        <p className="text-muted text-sm">{product.enemyAr}</p>

        {!compact && (
          <div className="stars text-brand text-sm" aria-label="تقييم">
            ★★★★★
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-ink font-bold text-lg">١٩٩ ر.س</span>
        </div>

        {!compact && (
          <p className="text-muted text-xs">{copy.pdp.ladderHint}</p>
        )}

        <div className={`flex flex-col gap-2 ${compact ? "mt-2" : "mt-3"}`}>
          <button
            onClick={handleAdd}
            className="w-full bg-brand-deep text-on-brand py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity min-h-[44px]"
          >
            {copy.pdp.addCta}
          </button>
          {!compact && (
            <Link
              href={`/products/${slug}`}
              className="text-center text-sm text-brand hover:underline py-1"
            >
              {copy.pdp.detailsCta}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
