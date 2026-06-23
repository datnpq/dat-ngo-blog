"use client";

import { useEffect } from "react";

export function CodeCopyButtons() {
  useEffect(() => {
    const pres = Array.from(
      document.querySelectorAll<HTMLPreElement>(".article-prose pre")
    );

    const cleanups: Array<() => void> = [];

    pres.forEach((pre) => {
      if (pre.dataset.copyReady) return;
      pre.dataset.copyReady = "1";
      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code");
      btn.className =
        "absolute top-2.5 right-2.5 px-2 py-1 text-[11px] font-medium rounded-md bg-white/10 text-slate-300 hover:bg-white/20 transition-colors";

      const onClick = async () => {
        const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = "Đã copy!";
          setTimeout(() => (btn.textContent = "Copy"), 1500);
        } catch {
          /* ignore */
        }
      };

      btn.addEventListener("click", onClick);
      pre.appendChild(btn);
      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        btn.remove();
        delete pre.dataset.copyReady;
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
