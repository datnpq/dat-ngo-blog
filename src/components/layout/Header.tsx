"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Liên hệ" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E9E9E9]">
      <nav className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-bold text-[15px] text-neutral-900 tracking-tight">dat.ngo</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden sm:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isActive(href)
                    ? "text-neutral-900 bg-neutral-900/[0.07]"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-900/[0.04]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile */}
        <button
          className="sm:hidden p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="sm:hidden border-t border-[#E9E9E9] bg-[#FAFAF8]">
          <ul className="max-w-4xl mx-auto px-5 py-3 flex flex-col gap-0.5">
            <li>
              <Link
                href="/"
                className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/" ? "text-neutral-900 bg-neutral-100" : "text-neutral-500 hover:text-neutral-900"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "text-neutral-900 bg-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
