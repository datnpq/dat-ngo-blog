// Feature: dat-ngo-blog
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { calculateReadingTime, truncateExcerpt } from "../content";

describe("calculateReadingTime", () => {
  it("handles boundary cases", () => {
    expect(calculateReadingTime("word")).toBe(1);
    expect(calculateReadingTime("word ".repeat(200).trim())).toBe(1);
    expect(calculateReadingTime("word ".repeat(201).trim())).toBe(2);
    expect(calculateReadingTime("word ".repeat(400).trim())).toBe(2);
    expect(calculateReadingTime("word ".repeat(401).trim())).toBe(3);
  });

  it("returns 1 for empty string", () => {
    expect(calculateReadingTime("")).toBe(1);
    expect(calculateReadingTime("   ")).toBe(1);
  });

  // Feature: dat-ngo-blog, Property 5: Reading time equals ceil(wordCount/200)
  it("Property 5: reading time equals ceil(wordCount/200)", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }).filter((s) => !/\s/.test(s)), {
          minLength: 1,
          maxLength: 500,
        }),
        (words) => {
          const body = words.join(" ");
          const wordCount = body.trim().split(/\s+/).length;
          const expected = Math.ceil(wordCount / 200);
          expect(calculateReadingTime(body)).toBe(expected);
        }
      ),
      { numRuns: 200 }
    );
  });
});

describe("truncateExcerpt", () => {
  it("does not truncate short text", () => {
    expect(truncateExcerpt("hello")).toBe("hello");
    expect(truncateExcerpt("x".repeat(160))).toBe("x".repeat(160));
  });

  it("truncates at maxLength", () => {
    const text = "x".repeat(200);
    expect(truncateExcerpt(text)).toBe("x".repeat(160));
    expect(truncateExcerpt(text).length).toBe(160);
  });

  it("respects custom maxLength", () => {
    expect(truncateExcerpt("hello world", 5)).toBe("hello");
  });

  // Feature: dat-ngo-blog, Property 5: excerpt ≤ 160 chars
  it("Property 5: truncated excerpt is always at most 160 chars", () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const result = truncateExcerpt(text);
        expect(result.length).toBeLessThanOrEqual(160);
      }),
      { numRuns: 200 }
    );
  });
});
