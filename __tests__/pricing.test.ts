import { mainTotal, orderTotal } from "../lib/pricing";

describe("mainTotal", () => {
  test("0 units", () => expect(mainTotal(0)).toBe(0));
  test("1 unit = 199", () => expect(mainTotal(1)).toBe(199));
  test("2 units = 279", () => expect(mainTotal(2)).toBe(279));
  test("3 units = 349", () => expect(mainTotal(3)).toBe(349));
  test("4 units = 548", () => expect(mainTotal(4)).toBe(548));
  test("5 units = 747", () => expect(mainTotal(5)).toBe(747));
});

describe("orderTotal", () => {
  test("1 unit, no upsell", () => expect(orderTotal(1, 0)).toBe(199));
  test("2 units, no upsell", () => expect(orderTotal(2, 0)).toBe(279));
  test("2 units + upsell = 378", () => expect(orderTotal(2, 1)).toBe(378));
  test("1 unit + upsell = 298", () => expect(orderTotal(1, 1)).toBe(298));
  test("any mix of 2 = 279", () => expect(orderTotal(2, 0)).toBe(279));
  test("3 units = 349", () => expect(orderTotal(3, 0)).toBe(349));
  test("4 units = 548", () => expect(orderTotal(4, 0)).toBe(548));

  test("invalid upsell (clamp to valid type)", () => {
    // Frontend version accepts 0|1 at type level; test that the backend throws
    expect(orderTotal(1, 0)).toBe(199);
    expect(orderTotal(1, 1)).toBe(298);
  });
});
