"use client";

import { useEffect, useState } from "react";
import { Eye } from "@phosphor-icons/react";

interface ViewCounterProps {
  slug: string;
  initial: number;
}

export function ViewCounter({ slug, initial }: ViewCounterProps) {
  const [views, setViews] = useState(initial);

  useEffect(() => {
    const key = `viewed_${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      return;
    }
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((r) => {
        if (r.ok) setViews((v) => v + 1);
      })
      .catch(() => {});
  }, [slug]);

  return (
    <span className="flex items-center gap-1">
      <Eye size={11} />
      {views.toLocaleString("vi-VN")} lượt đọc
    </span>
  );
}
