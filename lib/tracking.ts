/**
 * Browser pixel and CAPI helper.
 * All values sent raw (unhashed). TikTok phone needs +, Meta/Snap no +.
 * See docs/11-TRACKING-PIXELS-CAPI.md
 */

import type { PhoneResult } from "./phone";
import type { Slug } from "@/content/products";

declare global {
  interface Window {
    __nawaPixelQueue: NawaPixelCall[];
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; identify: (...args: unknown[]) => void };
    snaptr?: (...args: unknown[]) => void;
    __nawaPixelReady?: { meta?: boolean; tiktok?: boolean; snap?: boolean };
  }
}

export interface NawaPixelCall {
  platform: "meta" | "tiktok" | "snap";
  name: string;
  payload: Record<string, unknown>;
  eventId: string;
}

function ensureQueue() {
  if (typeof window === "undefined") return;
  if (!window.__nawaPixelQueue) window.__nawaPixelQueue = [];
}

function enqueue(call: NawaPixelCall) {
  ensureQueue();
  window.__nawaPixelQueue.push(call);
}

export function flushPixelQueue() {
  if (typeof window === "undefined") return;
  ensureQueue();
  const q = window.__nawaPixelQueue;
  const remaining: NawaPixelCall[] = [];
  for (const call of q) {
    if (!dispatchCall(call)) remaining.push(call);
  }
  window.__nawaPixelQueue = remaining;
}

function dispatchCall(call: NawaPixelCall): boolean {
  if (call.platform === "meta" && window.fbq) {
    window.fbq("track", call.name, call.payload, { eventID: call.eventId });
    return true;
  }
  if (call.platform === "tiktok" && window.ttq) {
    window.ttq.track(call.name, call.payload, { event_id: call.eventId });
    return true;
  }
  if (call.platform === "snap" && window.snaptr) {
    window.snaptr("track", call.name, { ...call.payload, client_dedup_id: call.eventId });
    return true;
  }
  return false;
}

// ── Identify ────────────────────────────────────────────────

export function identifyPixels(phone: PhoneResult, externalId: string) {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const ttPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const snapPixelId = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;

  if (metaPixelId && window.fbq) {
    window.fbq("init", metaPixelId, {
      ph: phone.metaDigits,
      country: "sa",
      external_id: externalId,
    });
  }
  if (ttPixelId && window.ttq) {
    window.ttq.identify({
      phone_number: phone.tiktokE164,
      external_id: externalId,
    });
  }
  if (snapPixelId && window.snaptr) {
    window.snaptr("init", snapPixelId, {
      user_phone_number: phone.metaDigits, // Snap raw: no plus
    });
  }
}

// ── Events ────────────────────────────────────────────────

export interface TrackEventParams {
  eventId?: string;
  value?: number;
  currency?: string;
  contentIds?: Slug[];
  contents?: { id: string; quantity: number; item_price: number; name?: string }[];
  numItems?: number;
  orderId?: string;
  transactionId?: string;
}

export function trackPageView(eventId: string, url: string) {
  enqueue({ platform: "meta", name: "PageView", payload: {}, eventId });
  enqueue({ platform: "tiktok", name: "Pageview", payload: { page: { url } }, eventId });
  enqueue({ platform: "snap", name: "PAGE_VIEW", payload: { page_url: url }, eventId });
  flushPixelQueue();
}

export function trackViewContent(eventId: string, params: TrackEventParams) {
  const base = {
    content_ids: params.contentIds,
    content_type: "product",
    currency: params.currency || "SAR",
    value: params.value,
  };
  enqueue({ platform: "meta", name: "ViewContent", payload: base, eventId });
  enqueue({ platform: "tiktok", name: "ViewContent", payload: {
    contents: (params.contentIds || []).map(id => ({ content_id: id })),
    content_type: "product",
    currency: params.currency || "SAR",
    value: params.value,
  }, eventId });
  enqueue({ platform: "snap", name: "VIEW_CONTENT", payload: base, eventId });
  flushPixelQueue();
}

export function trackAddToCart(eventId: string, params: TrackEventParams) {
  enqueue({ platform: "meta", name: "AddToCart", payload: {
    content_ids: params.contentIds,
    content_type: "product",
    currency: params.currency || "SAR",
    value: params.value,
    contents: params.contents,
    num_items: params.numItems,
  }, eventId });
  enqueue({ platform: "tiktok", name: "AddToCart", payload: {
    contents: (params.contentIds || []).map(id => ({ content_id: id })),
    content_type: "product",
    currency: params.currency || "SAR",
    value: params.value,
  }, eventId });
  enqueue({ platform: "snap", name: "ADD_CART", payload: {
    item_ids: params.contentIds,
    number_items: params.numItems,
    price: params.value,
    currency: params.currency || "SAR",
  }, eventId });
  flushPixelQueue();
}

export function trackInitiateCheckout(eventId: string, params: TrackEventParams) {
  const base = {
    content_ids: params.contentIds,
    content_type: "product",
    currency: params.currency || "SAR",
    value: params.value,
    num_items: params.numItems,
  };
  enqueue({ platform: "meta", name: "InitiateCheckout", payload: base, eventId });
  enqueue({ platform: "tiktok", name: "InitiateCheckout", payload: {
    contents: (params.contentIds || []).map(id => ({ content_id: id })),
    content_type: "product",
    currency: params.currency || "SAR",
    value: params.value,
  }, eventId });
  enqueue({ platform: "snap", name: "START_CHECKOUT", payload: {
    item_ids: params.contentIds,
    price: params.value,
    currency: params.currency || "SAR",
  }, eventId });
  flushPixelQueue();
}

export function trackPurchase(
  eventId: string,
  orderId: string,
  params: TrackEventParams
) {
  const key = `nawa_purchase_fired_${orderId}`;
  if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(key)) return;
  if (typeof sessionStorage !== "undefined") sessionStorage.setItem(key, "1");

  window.fbq?.("track", "Purchase", {
    value: params.value,
    currency: params.currency || "SAR",
    content_ids: params.contentIds,
    content_type: "product",
    contents: params.contents,
    num_items: params.numItems,
  }, { eventID: eventId });

  window.ttq?.track("CompletePayment", {
    contents: (params.contentIds || []).map(id => ({ content_id: id })),
    content_type: "product",
    value: params.value,
    currency: params.currency || "SAR",
  }, { event_id: eventId });

  window.snaptr?.("track", "PURCHASE", {
    client_dedup_id: eventId,
    transaction_id: orderId,
    price: params.value,
    currency: params.currency || "SAR",
    item_ids: params.contentIds,
    number_items: params.numItems,
  });
}
