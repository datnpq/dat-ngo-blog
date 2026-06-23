"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "@phosphor-icons/react";

const SEEN_KEY = "nl_modal_seen_at";
const SUBSCRIBED_KEY = "nl_subscribed";
const COOLDOWN_DAYS = 14;
const SCROLL_TRIGGER = 0.55; // 55% of the page

export function SubscribeModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const shouldShow = useCallback(() => {
    try {
      if (localStorage.getItem(SUBSCRIBED_KEY)) return false;
      const seen = localStorage.getItem(SEEN_KEY);
      if (seen) {
        const days = (Date.now() - Number(seen)) / 86_400_000;
        if (days < COOLDOWN_DAYS) return false;
      }
    } catch {
      return false;
    }
    return true;
  }, []);

  const trigger = useCallback(() => {
    if (!shouldShow()) return;
    setOpen(true);
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, [shouldShow]);

  useEffect(() => {
    if (!shouldShow()) return;

    const onScroll = () => {
      const scrolled =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= SCROLL_TRIGGER) {
        trigger();
        cleanup();
      }
    };
    // Desktop exit-intent: cursor leaves through the top of the viewport
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        trigger();
        cleanup();
      }
    };
    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
    return cleanup;
  }, [shouldShow, trigger]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "modal" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      try {
        localStorage.setItem(SUBSCRIBED_KEY, "1");
      } catch {
        /* ignore */
      }
      setTimeout(() => setOpen(false), 1800);
    } catch {
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl border border-[#E9E9E9] shadow-xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Đóng"
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X size={18} weight="bold" />
        </button>

        {status === "success" ? (
          <div className="py-6 text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p className="font-bold text-neutral-900 mb-1">Đăng ký thành công!</p>
            <p className="text-sm text-neutral-500">Cảm ơn bạn đã theo dõi.</p>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold mb-4">
              ĐN
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mb-1.5">
              Đừng bỏ lỡ bài viết mới
            </h2>
            <p className="text-sm text-neutral-500 mb-5">
              Nhận bài về WebAR, AI và hành trình Founder thẳng vào inbox. Không spam — chỉ khi có bài hay.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full px-3 py-2.5 text-sm border border-[#E9E9E9] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {status === "loading" ? "Đang gửi..." : "Đăng ký nhận bài"}
              </button>
              {status === "error" && (
                <p className="text-xs text-red-500">Có lỗi xảy ra, vui lòng thử lại.</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
