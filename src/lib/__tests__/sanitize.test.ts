// Feature: dat-ngo-blog
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { sanitizeHtml } from "../sanitize";

describe("sanitizeHtml", () => {
  it("removes <script> tags", () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).not.toContain("<script");
    expect(sanitizeHtml('<p>Hello</p><script>evil()</script>')).toBe("<p>Hello</p>");
  });

  it("removes inline event handlers", () => {
    expect(sanitizeHtml('<p onclick="evil()">text</p>')).not.toContain("onclick");
    expect(sanitizeHtml('<img onerror="evil()" src="x">')).not.toContain("onerror");
    expect(sanitizeHtml('<div onload="evil()">x</div>')).not.toContain("onload");
  });

  it("removes javascript: hrefs", () => {
    expect(sanitizeHtml('<a href="javascript:evil()">click</a>')).not.toContain("javascript:");
  });

  it("preserves safe content", () => {
    const safe = "<p>Hello <strong>world</strong></p>";
    expect(sanitizeHtml(safe)).toBe(safe);
  });

  it("preserves safe links", () => {
    const link = '<a href="https://example.com">link</a>';
    expect(sanitizeHtml(link)).toBe(link);
  });

  // Feature: dat-ngo-blog, Property 15: HTML sanitization removes all XSS vectors
  it("Property 15: removes <script> from arbitrary HTML strings", () => {
    fc.assert(
      fc.property(fc.string(), (arbitrary) => {
        const html = `<p>${arbitrary}</p><script>xss()</script>`;
        const result = sanitizeHtml(html);
        expect(result).not.toContain("<script");
        expect(result).not.toContain("</script>");
      }),
      { numRuns: 200 }
    );
  });

  it("Property 15: removes onclick event handlers from arbitrary content", () => {
    fc.assert(
      fc.property(fc.string(), (arbitrary) => {
        const html = `<div onclick="${arbitrary}">content</div>`;
        const result = sanitizeHtml(html);
        expect(result).not.toContain("onclick");
      }),
      { numRuns: 200 }
    );
  });

  it("Property 15: removes javascript: href", () => {
    fc.assert(
      fc.property(fc.string(), (payload) => {
        const html = `<a href="javascript:${payload}">link</a>`;
        const result = sanitizeHtml(html);
        expect(result).not.toContain("javascript:");
      }),
      { numRuns: 200 }
    );
  });
});
