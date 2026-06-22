"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
    // Let theme-aware widgets (e.g. Giscus) react in real time
    window.dispatchEvent(
      new CustomEvent("themechange", { detail: { dark: next } })
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={dark ? "Giao diện sáng" : "Giao diện tối"}
      className="grid place-items-center w-8 h-8 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/[0.06] transition-colors"
    >
      {/* Avoid hydration mismatch: render icon only after mount */}
      <span className="relative w-[18px] h-[18px]">
        {mounted && (
          <span
            key={dark ? "sun" : "moon"}
            className="absolute inset-0 grid place-items-center animate-fade-in"
          >
            {dark ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
          </span>
        )}
      </span>
    </button>
  );
}
