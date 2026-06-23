"use client";

import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

export function PostSearch() {
  const [q, setQ] = useState("");

  function handle(v: string) {
    setQ(v);
    const query = v.trim().toLowerCase();
    const items = document.querySelectorAll<HTMLElement>("#post-list .post-item");
    let visible = 0;
    items.forEach((el) => {
      const hay = el.dataset.search ?? "";
      const show = !query || hay.includes(query);
      el.style.display = show ? "" : "none";
      if (show) visible++;
    });
    const empty = document.getElementById("post-empty");
    if (empty) empty.style.display = visible === 0 ? "" : "none";
  }

  return (
    <div className="relative mt-5">
      <MagnifyingGlass
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      />
      <input
        type="search"
        value={q}
        onChange={(e) => handle(e.target.value)}
        placeholder="Tìm bài viết..."
        className="w-full sm:max-w-xs pl-9 pr-3 py-2 text-sm border border-[#E9E9E9] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
