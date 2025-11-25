import { describe, test, expect } from "bun:test";

describe("Math utilities – basic operations", () => {
  test("Should correctly sum two positive integers", () => {
    const a = 2;
    const b = 2;
    const result = a + b;
    expect(result).toBe(4);
  });
});
