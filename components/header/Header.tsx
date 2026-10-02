"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { copy } from "@/content/copy";
import { useCartStore } from "@/lib/cart-store";
import { AnnouncementBar } from "./AnnouncementBar";

const NAV_LINKS = [
  { label: copy.nav.home, href: "/" },
  { label: copy.nav.shop, href: "/shop" },
  { label: copy.nav.oud, href: "/products/oud" },
  { label: copy.nav.shafaq, href: "/products/shafaq" },
  { label: copy.nav.safa, href: "/products/safa" },
  { label: copy.nav.about, href: "/about" },
  { label: copy.nav.contact, href: "/contact" },
];

const POLICY_LINKS = [
  { label: "الشحن", href: "/policies/shipping" },
  { label: "الترجيع", href: "/policies/returns" },
  { label: "الخصوصية", href: "/policies/privacy" },
  { label: "الشروط", href: "/policies/terms" },
];

export function Header({ hideTicker = false }: { hideTicker?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const mainUnits = useCartStore((s) => s.mainUnits)();
  const upsellCount = useCartStore((s) => s.lines.filter((l) => l.pricing === "upsell").length);
  const cartCount = mainUnits + upsellCount;

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {!hideTicker && <AnnouncementBar />}
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          scrolled ? "bg-ivory border-b border-line shadow-sm" : "bg-transparent"
        }`}
        style={{ height: "64px" }}
      >
        <div className="max-w-[1120px] mx-auto h-full px-5 flex items-center justify-between">
          {/* Mobile: cart on left */}
          <button
            onClick={openCart}
            className="md:hidden relative p-2 text-ink"
            aria-label="السلة"
          >
            <CartIcon />
            {mounted && cartCount > 0 && <CartBadge count={cartCount} />}
          </button>

          {/* Logo — center mobile, right desktop */}
          <div className="absolute inset-0 flex items-center justify-center md:static md:justify-start">
            <Logo size="sm" />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-ink">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-brand transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side: desktop cart + mobile menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="hidden md:flex relative p-2 text-ink"
              aria-label="السلة"
            >
              <CartIcon />
              {mounted && cartCount > 0 && <CartBadge count={cartCount} />}
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 text-ink"
              aria-label="القائمة"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-ivory flex flex-col" role="dialog" aria-modal="true">
            <div className="flex justify-between items-center p-5 border-b border-line">
              <Logo size="sm" />
              <button onClick={() => setMenuOpen(false)} aria-label="إغلاق">
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-5 flex-1 overflow-y-auto">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-lg text-ink border-b border-line hover:text-brand"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-6 text-muted text-sm">
                {POLICY_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 hover:text-brand"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CartBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-0.5 -end-0.5 bg-brand text-on-brand text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
      {count}
    </span>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
