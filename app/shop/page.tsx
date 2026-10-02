import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "الطقوس الثلاث",
  description: "نوا عود، نوا شفق، ونوا صفاء. ثلاث قطع ضد ثلاثة أشياء في البيت.",
};

export default function ShopPage() {
  return (
    <div className="max-w-[1120px] mx-auto px-5 py-16">
      <div className="text-center mb-12">
        <h1 className="text-ink mb-3">{copy.shop.title}</h1>
        <p className="text-muted text-lg">{copy.shop.sub}</p>
      </div>

      {/* Anchor chips */}
      <div className="flex justify-center gap-3 flex-wrap mb-10">
        {["الكل", "الريحة", "الضوء", "الهواء"].map((chip, i) => {
          const hrefs = ["#all", "#oud", "#shafaq", "#safa"];
          return (
            <a
              key={chip}
              href={hrefs[i]}
              className="px-5 py-2 rounded-full border border-line text-muted text-sm hover:border-brand hover:text-brand transition-colors"
            >
              {chip}
            </a>
          );
        })}
      </div>

      {/* Grid */}
      <div id="all" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div id="oud"><ProductCard slug="oud" /></div>
        <div id="shafaq"><ProductCard slug="shafaq" /></div>
        <div id="safa"><ProductCard slug="safa" /></div>
      </div>

      {/* Ladder banner */}
      <div className="mt-16 bg-twilight text-on-brand rounded-[24px] p-10 text-center">
        <h2 className="text-on-brand mb-8">{copy.ladder.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {copy.ladder.tiers.map((tier) => (
            <div key={tier.label} className="bg-white/10 rounded-[16px] p-6">
              {tier.badge && (
                <div className="text-xs font-bold text-brand-deep bg-on-brand px-3 py-1 rounded-full inline-block mb-2">
                  {tier.badge}
                </div>
              )}
              <div className="text-on-brand/70 text-sm">{tier.label}</div>
              <div className="text-on-brand font-bold text-2xl mt-1">{tier.price}</div>
            </div>
          ))}
        </div>
        <p className="text-on-brand/70 text-sm">{copy.ladder.sub}</p>
      </div>
    </div>
  );
}
