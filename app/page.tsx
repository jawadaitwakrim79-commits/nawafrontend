import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { copy } from "@/content/copy";
import { REVIEWS } from "@/content/products";

export const metadata: Metadata = {
  title: "نوا للبيت · ريحة، ضوء، وهواء",
  description:
    "ثلاث طقوس للبيت السعودي: عود بلا فحم، شفق للغرفة، ومنقّي HEPA-13. الدفع عند الاستلام.",
};

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <section className="min-h-[90dvh] flex items-center">
        <div className="band max-w-[1120px] mx-auto px-5 py-16 w-full">
          <div className="copy flex flex-col justify-center gap-6">
            <p className="text-brand font-bold text-sm tracking-wide uppercase">
              {copy.hero.eyebrow}
            </p>
            <h1 className="text-ink">{copy.hero.headline}</h1>
            <p className="text-muted text-lg leading-relaxed max-w-[500px]">
              {copy.hero.sub}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="#rituals"
                className="inline-flex justify-center items-center bg-brand-deep text-on-brand py-4 px-8 rounded-full font-bold text-base hover:opacity-90 transition-opacity w-fit min-h-[52px]"
              >
                {copy.hero.cta} ↓
              </Link>
              <p className="text-muted text-sm">{copy.hero.trustLine}</p>
            </div>
          </div>
          <div className="media relative rounded-[20px] overflow-hidden bg-sand" style={{ minHeight: "400px" }}>
            <Image
              src="/images/hero-majlis.webp"
              alt="مجلس سعودي في المساء"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 560px"
            />
          </div>
        </div>
      </section>

      {/* ── 2. Rituals grid ── */}
      <section id="rituals" className="max-w-[1120px] mx-auto px-5 py-20">
        <h2 className="text-center text-ink mb-4">{copy.ritualsSection.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {(["oud", "shafaq", "safa"] as const).map((slug) => (
            <ProductCard key={slug} slug={slug} />
          ))}
        </div>
      </section>

      {/* ── 3. Story bands ── */}
      {copy.stories.map((story, i) => (
        <section
          key={story.href}
          className="max-w-[1120px] mx-auto px-5 py-16"
        >
          <div className={`band${i % 2 === 1 ? " flip" : ""}`}>
            <div className="copy flex flex-col justify-center gap-5">
              <h2 className="text-ink">{story.title}</h2>
              <p className="text-muted text-base leading-relaxed">{story.body}</p>
              <Link
                href={story.href}
                className="text-brand font-bold text-sm hover:underline"
              >
                {story.link} ←
              </Link>
            </div>
            <div
              className="media relative rounded-[20px] overflow-hidden bg-sand"
              style={{ minHeight: "320px" }}
            >
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 100vw, 560px"
              />
            </div>
          </div>
        </section>
      ))}

      {/* ── 4. Ladder ── */}
      <section className="bg-twilight text-on-brand py-20 px-5">
        <div className="max-w-[1120px] mx-auto text-center">
          <h2 className="text-on-brand mb-10">{copy.ladder.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {copy.ladder.tiers.map((tier) => (
              <div
                key={tier.label}
                className={`bg-white/10 rounded-[20px] p-8 flex flex-col items-center gap-3 ${
                  tier.badge ? "border-2 border-on-brand" : ""
                }`}
              >
                {tier.badge && (
                  <span className="text-xs font-bold bg-brand text-on-brand px-3 py-1 rounded-full">
                    {tier.badge}
                  </span>
                )}
                <span className="text-on-brand/70 text-sm">{tier.label}</span>
                <span className="text-on-brand font-bold text-3xl">{tier.price}</span>
              </div>
            ))}
          </div>
          <p className="text-on-brand/70 text-sm mb-8">{copy.ladder.sub}</p>
          <Link
            href="/shop"
            className="inline-flex bg-on-brand text-brand-deep py-4 px-10 rounded-full font-bold text-base hover:opacity-90 transition-opacity min-h-[52px]"
          >
            {copy.ladder.cta}
          </Link>
        </div>
      </section>

      {/* ── 5. Trust ── */}
      <section className="max-w-[1120px] mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {copy.trust.map((item) => (
            <div key={item} className="bg-ivory rounded-[16px] p-5 text-center">
              <p className="text-ink text-sm font-bold leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Reviews ── */}
      <section className="max-w-[1120px] mx-auto px-5 py-16">
        <h2 className="text-center text-ink mb-12">{copy.voices.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.author} className="bg-ivory rounded-[20px] p-6 flex flex-col gap-3">
              <div className="stars">★★★★★</div>
              <p className="text-ink text-base leading-relaxed">&laquo;{r.text}&raquo;</p>
              <p className="text-muted text-sm mt-auto">— {r.author}، {r.city}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="max-w-[720px] mx-auto px-5 py-16">
        <h2 className="text-center text-ink mb-10">{copy.faq.title}</h2>
        <div className="flex flex-col gap-4">
          {copy.faq.items.map((item) => (
            <details
              key={item.q}
              className="bg-ivory rounded-[16px] p-5 cursor-pointer group"
            >
              <summary className="font-bold text-ink list-none flex justify-between items-center">
                {item.q}
                <span className="text-muted group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="text-muted text-sm mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── 8. Close CTA ── */}
      <section className="text-center py-20 px-5">
        <h2 className="text-ink mb-6">{copy.close.title}</h2>
        <Link
          href="/shop"
          className="inline-flex bg-brand-deep text-on-brand py-4 px-10 rounded-full font-bold text-base hover:opacity-90 transition-opacity min-h-[52px]"
        >
          {copy.close.cta}
        </Link>
      </section>
    </>
  );
}
