"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { copy } from "@/content/copy";
import { PRODUCTS_ARRAY, type Slug } from "@/content/products";
import { ProductCard } from "@/components/product/ProductCard";

function ThankYouContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const [summary, setSummary] = useState<{ orderId: string; total: number } | null>(null);

  useEffect(() => {
    if (!orderId) return;
    try {
      const raw = sessionStorage.getItem("nawa_last_order");
      if (raw) {
        const parsed = JSON.parse(raw) as { orderId: string; total: number };
        if (parsed.orderId === orderId) setSummary(parsed);
      }
    } catch {/* ignore */}
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-20 text-center">
        <p className="text-muted">{copy.thankYou.notFoundMsg}</p>
        <Link href="/" className="mt-6 inline-flex text-brand underline">الرئيسية</Link>
      </div>
    );
  }

  // All products are potential cross-sells (she placed one order, she might want others)
  const crossSells = PRODUCTS_ARRAY.slice(0, 2);

  return (
    <div className="max-w-[720px] mx-auto px-5 py-20">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-ink">{copy.thankYou.title}</h1>
        <p className="text-muted mt-2">
          {copy.thankYou.orderLabel}:{" "}
          <span className="font-bold text-ink" dir="ltr">
            {orderId}
          </span>
        </p>
        {summary && (
          <p className="text-muted mt-1">
            {copy.thankYou.totalLabel}:{" "}
            <span className="font-bold text-ink">
              {summary.total} {copy.thankYou.currency}
            </span>{" "}
            — {copy.thankYou.cod}
          </p>
        )}
      </div>

      {/* Confirmation block */}
      <div className="bg-brand text-on-brand rounded-[20px] p-8 text-center mb-10">
        <div className="text-3xl mb-4">📞</div>
        <p className="text-on-brand text-lg font-bold leading-relaxed">
          {copy.thankYou.callBlock}
        </p>
        <p className="text-on-brand/80 text-sm mt-3">{copy.thankYou.hours}</p>
        <p className="text-on-brand/80 text-sm mt-2">{copy.thankYou.prepare}</p>
      </div>

      {/* Cross-sells */}
      <div>
        <h2 className="text-ink mb-6">{copy.thankYou.crossTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crossSells.map((p) => (
            <ProductCard key={p.slug} slug={p.slug} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ThankYouClient() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-muted">جاري التحميل...</div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
