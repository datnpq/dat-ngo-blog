"use client";

import { useState } from "react";

interface NewsletterCTAProps {
  variant?: "homepage" | "post";
}

export function NewsletterCTA({ variant = "post" }: NewsletterCTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      // Buttondown API — set NEXT_PUBLIC_BUTTONDOWN_USERNAME to activate
      const username = process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME;
      if (username) {
        const res = await fetch(`https://api.buttondown.email/v1/subscribers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${process.env.NEXT_PUBLIC_BUTTONDOWN_API_KEY ?? ""}`,
          },
          body: JSON.stringify({ email_address: email, tags: ["dat.ngo"] }),
        });
        if (!res.ok) throw new Error("Failed");
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (variant === "homepage") {
    return (
      <section className="pt-8 border-t border-[#E9E9E9]">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
          Newsletter
        </p>
        <p className="text-sm text-neutral-600 mb-4 max-w-sm">
          Bài viết mới về WebAR, AI và hành trình Founder — thẳng vào inbox.
        </p>
        <NewsletterForm email={email} setEmail={setEmail} status={status} onSubmit={handleSubmit} compact />
      </section>
    );
  }

  return (
    <div className="my-12 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
          ĐN
        </div>
        <div className="flex-1">
          <p className="font-bold text-neutral-900 mb-1">Nhận bài viết mới qua email</p>
          <p className="text-sm text-neutral-500 mb-4">
            Viết về WebAR, Spatial Computing, AI và hành trình Founder. Không spam — chỉ khi có bài hay.
          </p>
          <NewsletterForm email={email} setEmail={setEmail} status={status} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

function NewsletterForm({
  email, setEmail, status, onSubmit, compact = false,
}: {
  email: string;
  setEmail: (v: string) => void;
  status: "idle" | "loading" | "success" | "error";
  onSubmit: (e: React.FormEvent) => void;
  compact?: boolean;
}) {
  if (status === "success") {
    return (
      <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
        <span>✓</span> Đăng ký thành công! Cảm ơn bạn.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`flex gap-2 ${compact ? "max-w-xs" : "max-w-sm"}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="email@example.com"
        className="flex-1 px-3 py-2 text-sm border border-[#E9E9E9] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
      >
        {status === "loading" ? "..." : "Đăng ký"}
      </button>
    </form>
  );
}
