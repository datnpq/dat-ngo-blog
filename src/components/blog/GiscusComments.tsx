"use client";

import { useEffect, useRef } from "react";

interface GiscusCommentsProps {
  slug: string;
}

export function GiscusComments({ slug }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO ?? "";
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "";
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "General";
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "";

  useEffect(() => {
    if (!repo || !repoId || !categoryId) return;
    if (initialized.current) return;
    initialized.current = true;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", slug);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "vi");
    script.setAttribute("data-loading", "lazy");

    containerRef.current?.appendChild(script);
  }, [repo, repoId, category, categoryId, slug]);

  if (!repo || !repoId || !categoryId) {
    return null;
  }

  return (
    <section className="pt-8 border-t border-[#E9E9E9]">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">
        Bình luận
      </p>
      <div ref={containerRef} />
    </section>
  );
}
