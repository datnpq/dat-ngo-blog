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
      className="fixed bottom-8 right-6 z-50 p-2.5 rounded-full bg-white border border-[#E9E9E9] text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 shadow-md transition-all duration-200"
    >
      <ArrowUp size={16} weight="bold" />
    </button>
  );
}
