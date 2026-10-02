/**
 * Frontend API helpers — all calls go to NEXT_PUBLIC_API_URL.
 * Never fetches the sheet. Never hashes.
 */

import type { Slug } from "@/content/products";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.nawahouse.shop";

export interface OrderLine {
  slug: Slug;
  quantity: number;
  pricing: "main" | "upsell";
}

export interface OrderPayload {
  event_id: string;
  name: string;
  phone: string;
  lines: OrderLine[];
  page_url?: string;
  fbp?: string | null;
  fbc?: string | null;
  ttp?: string | null;
  ttclid?: string | null;
  sc_click_id?: string | null;
  external_id?: string | null;
  event_source_url?: string;
}

export interface OrderResponse {
  order_id: string;
  event_id: string;
  total_sar: number;
  currency: string;
}

export async function submitOrder(payload: OrderPayload): Promise<OrderResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(`${API}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Order API ${res.status}`);
    }
    return (await res.json()) as OrderResponse;
  } finally {
    clearTimeout(timeout);
  }
}

export interface EventPayload {
  event_name: string;
  event_id: string;
  page_url?: string;
  value?: number;
  currency?: string;
  content_ids?: Slug[];
  phone?: string;
  external_id?: string;
  fbp?: string | null;
  fbc?: string | null;
  ttp?: string | null;
  ttclid?: string | null;
  sc_click_id?: string | null;
}

export async function sendEvent(payload: EventPayload): Promise<void> {
  try {
    await fetch(`${API}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort, never block
  }
}

export interface ContactPayload {
  name: string;
  phone: string;
  message: string;
}

export async function sendContact(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${API}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Contact API error");
}
