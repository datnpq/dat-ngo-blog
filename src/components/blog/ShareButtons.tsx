"use client";

import { useState } from "react";
import { XLogo, LinkedinLogo, FacebookLogo, LinkSimple, Check } from "@phosphor-icons/react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const t = encodeURIComponent(title);
  const u = encodeURIComponent(url);

  const targets = [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, Icon: XLogo },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: LinkedinLogo },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FacebookLogo },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-400 mr-1">Chia sẻ</span>
      {targets.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chia sẻ lên ${label}`}
          className="grid place-items-center w-8 h-8 rounded-lg border border-[#E9E9E9] text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-colors"
        >
          <Icon size={15} />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="grid place-items-center w-8 h-8 rounded-lg border border-[#E9E9E9] text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-colors"
      >
        {copied ? <Check size={15} className="text-emerald-600" /> : <LinkSimple size={15} />}
      </button>
    </div>
  );
}
