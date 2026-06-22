"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Về đầu trang"
      className="fixed bottom-8 right-6 z-50 p-2.5 rounded-full bg-card border border-border text-ink-secondary hover:text-ink hover:border-border-hover hover:-translate-y-0.5 shadow-md transition-all duration-200 animate-fade-in"
    >
      <ArrowUp size={16} weight="bold" />
    </button>
  );
}
