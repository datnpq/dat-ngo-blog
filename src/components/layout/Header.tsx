"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";

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
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
      <nav className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-bold text-[15px] text-ink tracking-tight">dat.ngo</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          <ul className="flex items-center gap-0.5">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isActive(href)
                      ? "text-ink bg-ink/[0.07]"
                      : "text-ink-secondary hover:text-ink hover:bg-ink/[0.04]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="w-px h-5 bg-border mx-1.5" />
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button
            className="p-1.5 text-ink-secondary hover:text-ink rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-surface">
          <ul className="max-w-4xl mx-auto px-5 py-3 flex flex-col gap-0.5">
            <li>
              <Link
                href="/"
                className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/" ? "text-ink bg-elevated" : "text-ink-secondary hover:text-ink"
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
                      ? "text-ink bg-elevated"
                      : "text-ink-secondary hover:text-ink"
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
