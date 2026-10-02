/**
 * Pricing — client-side mirror of the Python function.
 * Server always rechecks; this is display-only.
 */

export function mainTotal(units: number): number {
  if (units <= 0) return 0;
  if (units === 1) return 199;
  if (units === 2) return 279;
  if (units === 3) return 349;
  return 349 + 199 * (units - 3);
}

export function orderTotal(mainUnits: number, upsellUnits: 0 | 1): number {
  return mainTotal(mainUnits) + 99 * upsellUnits;
}

/** Format an integer SAR amount as an Arabic-Indic display string */
export function formatSAR(amount: number): string {
  return toArabicIndic(amount) + " ر.س";
}

function toArabicIndic(n: number): string {
  return n
    .toString()
    .replace(/0/g, "٠")
    .replace(/1/g, "١")
    .replace(/2/g, "٢")
    .replace(/3/g, "٣")
    .replace(/4/g, "٤")
    .replace(/5/g, "٥")
    .replace(/6/g, "٦")
    .replace(/7/g, "٧")
    .replace(/8/g, "٨")
    .replace(/9/g, "٩");
}
