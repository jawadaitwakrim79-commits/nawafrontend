"use client";

import { useState } from "react";
import Link from "next/link";
import { copy } from "@/content/copy";

/* ── Section data ──────────────────────────────────────── */
const SECTIONS = [
  {
    title: "الطقوس",
    items: [
      { label: "نوا عود", href: "/products/oud" },
      { label: "نوا شفق", href: "/products/shafaq" },
      { label: "نوا صفاء", href: "/products/safa" },
      { label: "كل الطقوس", href: "/shop" },
    ],
  },
  {
    title: "نوا",
    items: [
      { label: "حكاية نوا", href: "/about" },
      { label: "الطقوس الثلاث", href: "/shop" },
    ],
  },
  {
    title: "الدعم",
    items: [
      { label: "تواصل معنا", href: "/contact" },
      { label: "Email: Contact@nawaHouse.shop", href: "mailto:contact@nawahouse.shop" },
    ],
  },
  {
    title: "الشحن",
    items: [
      { label: "الشحن داخل السعودية فقط", href: "/policies/shipping" },
    ],
  },
  {
    title: "الدفع",
    items: [
      { label: "الدفع عند الاستلام", href: "/policies/terms" },
    ],
  },
] as const;

/* ── Footer ──────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="bg-ivory border-t border-line mt-24">
      <div className="max-w-[1120px] mx-auto px-5 py-12">

        {/* Mobile: collapsible accordion */}
        <div className="flex flex-col divide-y divide-line md:hidden mb-8">
          {SECTIONS.map((s) => (
            <AccordionSection key={s.title} title={s.title} items={s.items} />
          ))}
        </div>

        {/* Desktop: columns grid */}
        <div className="hidden md:grid grid-cols-5 gap-8 mb-12">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h4 className="font-bold text-ink mb-4 text-sm">{s.title}</h4>
              <ul className="flex flex-col gap-2">
                {s.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-muted text-sm hover:text-brand transition-colors break-all"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-line pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-muted text-sm">
          <span>{copy.brand.copyright}</span>
          <span className="bg-brand text-on-brand px-4 py-1.5 rounded-full text-xs font-bold">
            {copy.footer.cod}
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ── Accordion item (mobile only) ───────────────────────── */
function AccordionSection({
  title,
  items,
}: {
  title: string;
  items: readonly { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center py-4 text-ink font-bold text-sm"
        aria-expanded={open}
      >
        {title}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul className="flex flex-col gap-3 pb-4">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-muted text-sm hover:text-brand transition-colors break-all"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
