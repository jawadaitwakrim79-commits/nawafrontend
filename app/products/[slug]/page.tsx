import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, PRODUCTS_ARRAY, type Slug } from "@/content/products";
import { copy } from "@/content/copy";
import { PDPHero } from "@/components/product/PDPHero";
import { ProductCard } from "@/components/product/ProductCard";

export async function generateStaticParams() {
  return (["oud", "shafaq", "safa"] as Slug[]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS[slug as Slug];
  if (!product) return {};
  return {
    title: product.nameAr,
    description: product.oneLine,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS[slug as Slug];
  if (!product) notFound();

  const crossSlugs = product.crossSellOrder;

  return (
    <>
      {/* Hero */}
      <PDPHero slug={product.slug} />

      {/* Enemy section */}
      <section className="bg-twilight text-on-brand py-16 px-5">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="text-on-brand/60 text-sm mb-4">{copy.pdp.enemySection}</p>
          <h2 className="text-on-brand">{product.enemyAr}</h2>
          <p className="text-on-brand/70 mt-4 text-base leading-relaxed">{product.oneLine}</p>
        </div>
      </section>

      {/* Proof points */}
      <section className="max-w-[1120px] mx-auto px-5 py-16">
        <p className="text-muted text-sm mb-6">{copy.pdp.scienceSection}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.proofPoints.map((pt, i) => (
            <div key={i} className="bg-ivory rounded-[20px] p-6">
              <div className="text-brand font-bold text-2xl mb-3">{i + 1}</div>
              <p className="text-ink text-base leading-relaxed">{pt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Materials table */}
      <section className="max-w-[1120px] mx-auto px-5 py-12">
        <p className="text-muted text-sm mb-6">{copy.pdp.materialsSection}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="text-start py-3 pe-4 text-muted font-bold">
                  {copy.pdp.materialsHeader.thing}
                </th>
                <th className="text-start py-3 pe-4 text-muted font-bold">
                  {copy.pdp.materialsHeader.does}
                </th>
                <th className="text-start py-3 text-muted font-bold">
                  {copy.pdp.materialsHeader.matters}
                </th>
              </tr>
            </thead>
            <tbody>
              {product.materialsTable.map((row) => (
                <tr key={row.thing} className="border-b border-line/50">
                  <td className="py-3 pe-4 font-bold text-ink">{row.thing}</td>
                  <td className="py-3 pe-4 text-muted">{row.does}</td>
                  <td className="py-3 text-muted">{row.matters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ritual */}
      <section className="max-w-[720px] mx-auto px-5 py-16">
        <p className="text-muted text-sm mb-6">{copy.pdp.ritualSection}</p>
        <h2 className="text-ink mb-8">{product.ritualAr}</h2>
        <ol className="flex flex-col gap-4">
          {product.ritualSteps.map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-brand text-on-brand flex items-center justify-center font-bold text-sm flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-ink text-base leading-relaxed pt-1">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Cross-sells */}
      <section className="max-w-[1120px] mx-auto px-5 py-16">
        <h2 className="text-ink mb-8">{copy.pdp.crossSellTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crossSlugs.map((s) => (
            <ProductCard key={s} slug={s} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[720px] mx-auto px-5 py-16">
        <h2 className="text-ink mb-8">{copy.pdp.faqTitle}</h2>
        <div className="flex flex-col gap-4">
          {product.faqSeeds.map((faq) => (
            <details key={faq.q} className="bg-ivory rounded-[16px] p-5 cursor-pointer group">
              <summary className="font-bold text-ink list-none flex justify-between items-center">
                {faq.q}
                <span className="text-muted group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="text-muted text-sm mt-3 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ivory py-16 px-5">
        <PDPHero slug={product.slug} />
      </section>
    </>
  );
}
