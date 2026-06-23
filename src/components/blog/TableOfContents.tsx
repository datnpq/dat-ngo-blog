"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector(".article-prose");
    if (!article) return;

    const nodes = Array.from(article.querySelectorAll("h2, h3")) as HTMLElement[];
    const used = new Set<string>();
    const items: Heading[] = nodes.map((el) => {
      let id = el.id || slugify(el.textContent ?? "");
      while (id && used.has(id)) id += "-x";
      used.add(id);
      el.id = id;
      return { id, text: el.textContent ?? "", level: el.tagName === "H3" ? 3 : 2 };
    });

    if (items.length < 3) return; // not worth a ToC for short posts
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId((entry.target as HTMLElement).id);
        }
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0 }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="my-8 p-5 bg-neutral-50 border border-[#E9E9E9] rounded-2xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
        Trong bài này
      </p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", `#${h.id}`);
              }}
              className={`text-sm transition-colors ${
                activeId === h.id
                  ? "text-blue-600 font-medium"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
