"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { copy } from "@/content/copy";
import { PRODUCTS, getUpsellSlug, type Slug } from "@/content/products";
import { mainTotal, orderTotal } from "@/lib/pricing";
import { isValidPhone, normalizePhone } from "@/lib/phone";
import { submitOrder } from "@/lib/api";
import { trackPurchase, identifyPixels } from "@/lib/tracking";

type Step = "checkout" | "upsell" | "submitting";

export function CheckoutModal() {
  const router = useRouter();
  const { lines, closeCheckout, setUpsell, clearCart } = useCartStore();
  const mainLines = lines.filter((l) => l.pricing === "main");
  const mainUnits = mainLines.reduce((s, l) => s + l.quantity, 0);
  const total = mainTotal(mainUnits);

  const [step, setStep] = useState<Step>("checkout");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [apiError, setApiError] = useState("");
  const [countdown, setCountdown] = useState(15);
  const [upsellSlug, setUpsellSlug] = useState<Slug>("oud");
  const [eventId, setEventId] = useState<string | null>(null);
  const [inFlight, setInFlight] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Identify pixels when phone becomes valid
  useEffect(() => {
    if (!isValidPhone(phone)) return;
    const p = normalizePhone(phone);
    if (!p) return;
    const eid = typeof localStorage !== "undefined"
      ? (localStorage.getItem("nawa_eid") || crypto.randomUUID())
      : crypto.randomUUID();
    identifyPixels(p, eid);
  }, [phone]);

  // Focus on open
  useEffect(() => { modalRef.current?.focus(); }, []);

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") closeCheckout(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [closeCheckout]);

  // Cleanup timer
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function validateForm(): boolean {
    let ok = true;
    const n = name.trim();
    if (n.length < 2 || n.length > 60 || /^\d+$/.test(n)) {
      setNameError(copy.checkout.nameError);
      ok = false;
    } else setNameError("");

    if (!isValidPhone(phone)) {
      setPhoneError(copy.checkout.phoneError);
      ok = false;
    } else setPhoneError("");

    return ok;
  }

  function handleSubmit() {
    if (!validateForm()) return;
    const eid = crypto.randomUUID();
    setEventId(eid);
    const slugsInCart = new Set(mainLines.map((l) => l.slug as Slug));
    setUpsellSlug(getUpsellSlug(slugsInCart));
    setCountdown(15);
    setStep("upsell");
    startTimer(eid, false);
  }

  function startTimer(eid: string, withUpsell: boolean) {
    if (timerRef.current) clearInterval(timerRef.current);
    let t = 15;
    timerRef.current = setInterval(() => {
      t -= 1;
      setCountdown(t);
      if (t <= 0) {
        clearInterval(timerRef.current!);
        void placeOrder(eid, withUpsell);
      }
    }, 1000);
  }

  function handleYes() {
    if (!eventId) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setUpsell(upsellSlug);
    void placeOrder(eventId, true);
  }

  function handleNo() {
    if (!eventId) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setUpsell(null);
    void placeOrder(eventId, false);
  }

  const placeOrder = useCallback(
    async (eid: string, withUpsell: boolean) => {
      if (inFlight) return;
      setInFlight(true);
      setStep("submitting");
      setApiError("");

      const orderLines: { slug: Slug; quantity: number; pricing: "main" | "upsell" }[] =
        mainLines.map((l) => ({ slug: l.slug, quantity: l.quantity, pricing: "main" as const }));
      if (withUpsell) {
        orderLines.push({ slug: upsellSlug, quantity: 1, pricing: "upsell" as const });
      }

      const upsellUnits: 0 | 1 = withUpsell ? 1 : 0;
      const finalTotal = orderTotal(mainUnits, upsellUnits);

      const fbp = getCookie("_fbp");
      const fbc = getCookie("_fbc");
      const ttp = getCookie("_ttp");
      const ttclid = getStorage("nawa_ttclid");
      const sc_click_id = getStorage("nawa_sc_cid");
      const external_id = getStorage("nawa_eid");

      try {
        const res = await submitOrder({
          event_id: eid,
          name: name.trim(),
          phone,
          lines: orderLines,
          page_url: window.location.href,
          event_source_url: `https://nawahouse.shop/thank-you`,
          fbp: fbp || null,
          fbc: fbc || null,
          ttp: ttp || null,
          ttclid: ttclid || null,
          sc_click_id: sc_click_id || null,
          external_id: external_id || null,
        });

        sessionStorage.setItem(
          "nawa_last_order",
          JSON.stringify({ orderId: res.order_id, total: res.total_sar })
        );

        trackPurchase(eid, res.order_id, {
          value: finalTotal,
          currency: "SAR",
          contentIds: mainLines.map((l) => l.slug as Slug),
          numItems: mainUnits + upsellUnits,
          orderId: res.order_id,
        });

        clearCart();
        router.push(`/thank-you?order=${res.order_id}`);
      } catch {
        setApiError(copy.errorOrder);
        setStep("checkout");
        setInFlight(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inFlight, mainLines, mainUnits, name, phone, upsellSlug]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={closeCheckout} aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="تأكيد الطلب"
        className="relative z-10 w-full md:max-w-[480px] bg-paper rounded-t-[24px] md:rounded-[24px] max-h-[92dvh] overflow-y-auto outline-none"
      >
        {step === "checkout" && (
          <CheckoutStep
            mainLines={mainLines}
            total={total}
            name={name} setName={setName} nameError={nameError}
            phone={phone} setPhone={setPhone} phoneError={phoneError}
            apiError={apiError}
            onSubmit={handleSubmit}
            onClose={closeCheckout}
          />
        )}

        {step === "upsell" && (
          <UpsellStep
            slug={upsellSlug}
            countdown={countdown}
            onYes={handleYes}
            onNo={handleNo}
          />
        )}

        {step === "submitting" && (
          <div className="p-10 text-center text-muted">
            <div className="text-4xl mb-4">⏳</div>
            <p>{copy.upsell.pendingMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Combined checkout step: summary + form ──────────────────── */
function CheckoutStep({
  mainLines, total,
  name, setName, nameError,
  phone, setPhone, phoneError,
  apiError, onSubmit, onClose,
}: {
  mainLines: { slug: Slug; quantity: number }[];
  total: number;
  name: string; setName: (v: string) => void; nameError: string;
  phone: string; setPhone: (v: string) => void; phoneError: string;
  apiError: string;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const valid = name.trim().length >= 2 && isValidPhone(phone);

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-ink">تأكيد طلبكِ</h2>
        <button onClick={onClose} className="p-1 text-muted hover:text-ink" aria-label="إغلاق">
          <CloseIcon />
        </button>
      </div>

      {/* Order summary */}
      <div className="bg-ivory rounded-[14px] p-4 flex flex-col gap-3">
        <p className="text-sm font-bold text-ink">ملخص الطلب</p>

        {mainLines.map((l) => {
          const p = PRODUCTS[l.slug];
          return (
            <div key={l.slug} className="flex items-center gap-3">
              <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-sand flex-shrink-0">
                <Image src={p.imageSrcs[0]} alt={p.nameAr} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-ink">{p.nameAr}</span>
              </div>
              <span className="text-sm text-muted">× {l.quantity}</span>
            </div>
          );
        })}

        <div className="border-t border-line pt-3 flex justify-between items-center">
          <span className="font-bold text-ink">المجموع</span>
          <span className="font-bold text-ink text-lg">{total} <span className="text-muted text-sm font-normal">ر.س</span></span>
        </div>
      </div>

      {/* COD note */}
      <p className="text-muted text-sm leading-relaxed">
        الدفع عند الاستلام، ونتصل بك لتأكيد العنوان قبل أن يخرج المندوب.
      </p>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-ink">الاسم</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={copy.checkout.namePlaceholder}
          maxLength={60}
          className="border border-line rounded-xl px-4 py-3 bg-paper text-ink text-base outline-none focus:border-brand transition-colors"
        />
        {nameError && <span className="text-brand text-xs">{nameError}</span>}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-ink">الجوال</label>
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={copy.checkout.phonePlaceholder}
          className="border border-line rounded-xl px-4 py-3 bg-paper text-ink text-base outline-none focus:border-brand transition-colors"
          dir="ltr"
        />
        {phoneError && <span className="text-brand text-xs">{phoneError}</span>}
      </div>

      {apiError && (
        <p className="text-brand text-sm bg-red-50 p-3 rounded-xl">{apiError}</p>
      )}

      {/* CTA */}
      <button
        onClick={onSubmit}
        disabled={!valid}
        className="w-full bg-brand-deep text-on-brand py-4 rounded-full font-bold text-base disabled:opacity-40 hover:opacity-90 active:scale-[0.98] transition-all min-h-[56px]"
      >
        أكّدي الطلب بالدفع عند الاستلام
      </button>
    </div>
  );
}

/* ── Upsell step ─────────────────────────────────────────────── */
function UpsellStep({
  slug, countdown, onYes, onNo,
}: {
  slug: Slug; countdown: number; onYes: () => void; onNo: () => void;
}) {
  const product = PRODUCTS[slug];
  return (
    <div className="p-6 flex flex-col gap-5 items-center text-center">
      <div className="text-sm font-bold text-brand">{copy.upsell.title}</div>
      <div className="text-3xl font-bold text-ink">
        {countdown} <span className="text-muted text-base">{copy.upsell.timerLabel}</span>
      </div>

      <div className="bg-ivory rounded-[16px] p-5 w-full">
        <div className="text-xl font-bold text-ink mb-1">{product.nameAr}</div>
        <div className="text-muted text-sm mb-3">{product.enemyAr}</div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-muted line-through text-sm">{copy.upsell.price199}</span>
          <span className="text-brand font-bold text-2xl">{copy.upsell.price99}</span>
        </div>
      </div>

      <button
        onClick={onYes}
        className="w-full bg-brand-deep text-on-brand py-4 rounded-full font-bold text-base hover:opacity-90 transition-opacity min-h-[52px]"
      >
        {copy.upsell.yesCta}
      </button>
      <button onClick={onNo} className="text-muted text-sm underline hover:text-ink">
        {copy.upsell.noCta}
      </button>
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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
}

function getStorage(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
