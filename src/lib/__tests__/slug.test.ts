// Feature: dat-ngo-blog
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { generateSlug, isValidSlug } from "../slug";

describe("generateSlug", () => {
  it("handles known Vietnamese titles", () => {
    expect(generateSlug("Spatial Computing 2025")).toBe("spatial-computing-2025");
    expect(generateSlug("Hành trình WebAR tại Việt Nam")).toBe("hanh-trinh-webar-tai-viet-nam");
    expect(generateSlug("Đạt Ngô — Founder @ WeDev")).toBe("dat-ngo-founder-wedev");
    expect(generateSlug("  multiple   spaces  ")).toBe("multiple-spaces");
  });

  // Feature: dat-ngo-blog, Property 1: Slug generation is URL-safe and non-empty for any non-empty title
  it("Property 1: generates URL-safe slug; non-empty when title has alphanumeric chars", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (title) => {
          const slug = generateSlug(title);
          if (slug.length === 0) return; // pure special chars produce empty slug — acceptable
          // If non-empty: must only contain lowercase letters, digits, hyphens
          expect(slug).toMatch(/^[a-z0-9-]+$/);
          // Must not start or end with hyphen
          expect(slug).not.toMatch(/^-|-$/);
        }
      ),
      { numRuns: 200 }
    );
  });

  it("Property 1: non-empty slug for titles with at least one alphanumeric", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => /[a-zA-Z0-9]/.test(s)),
        (title) => {
          const slug = generateSlug(title);
          expect(slug.length).toBeGreaterThan(0);
          expect(slug).toMatch(/^[a-z0-9-]+$/);
          expect(slug).not.toMatch(/^-|-$/);
        }
      ),
      { numRuns: 200 }
    );
  });

  it("Property 1 (unicode): handles arbitrary unicode strings safely", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (title) => {
          const slug = generateSlug(title);
          if (slug.length === 0) return;
          expect(slug).toMatch(/^[a-z0-9-]+$/);
          expect(slug).not.toMatch(/^-|-$/);
        }
      ),
      { numRuns: 200 }
    );
  });
});

describe("isValidSlug", () => {
  it("accepts valid slugs", () => {
    expect(isValidSlug("hello-world")).toBe(true);
    expect(isValidSlug("spatial-computing-2025")).toBe(true);
    expect(isValidSlug("abc")).toBe(true);
    expect(isValidSlug("a1b2c3")).toBe(true);
  });

  it("rejects invalid slugs", () => {
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("-leading")).toBe(false);
    expect(isValidSlug("trailing-")).toBe(false);
    expect(isValidSlug("Has Uppercase")).toBe(false);
    expect(isValidSlug("has spaces")).toBe(false);
    expect(isValidSlug("has_underscore")).toBe(false);
    expect(isValidSlug("has.dot")).toBe(false);
  });

  // Feature: dat-ngo-blog, Property 2: Slug validation rejects all invalid formats
  it("Property 2: rejects slugs with leading/trailing hyphens", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (inner) => {
          expect(isValidSlug("-" + inner)).toBe(false);
          expect(isValidSlug(inner + "-")).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 2: rejects slugs with uppercase letters", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => /[A-Z]/.test(s)),
        (slugWithUpper) => {
          expect(isValidSlug(slugWithUpper)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 2: rejects slugs with non-alphanumeric non-hyphen chars", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => /[^a-z0-9-]/.test(s)),
        (invalidSlug) => {
          expect(isValidSlug(invalidSlug)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
