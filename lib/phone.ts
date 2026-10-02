/**
 * Saudi phone normalisation — browser side.
 * Returns PhoneResult or null for invalid input.
 * NEVER hashes here. Raw values go to pixels.
 */

export interface PhoneResult {
  e164: string;         // "+966512345678"
  metaDigits: string;   // "966512345678" — for Meta and Snap raw
  tiktokE164: string;   // "+966512345678" — for TikTok raw
}

const NATIONAL_RE = /^5\d{8}$/;

function stripFormatting(raw: string): string {
  return raw.replace(/[\s\-()]/g, "");
}

export function normalizePhone(raw: string): PhoneResult | null {
  if (!raw) return null;
  let cleaned = stripFormatting(raw);

  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
  if (cleaned.startsWith("00")) cleaned = cleaned.slice(2);

  let national: string;
  if (cleaned.startsWith("966")) {
    national = cleaned.slice(3);
  } else if (cleaned.startsWith("0")) {
    national = cleaned.slice(1);
  } else {
    national = cleaned;
  }

  if (!NATIONAL_RE.test(national)) return null;

  const metaDigits = "966" + national;
  const e164 = "+" + metaDigits;

  return { e164, metaDigits, tiktokE164: e164 };
}

export function isValidPhone(raw: string): boolean {
  return normalizePhone(raw) !== null;
}
