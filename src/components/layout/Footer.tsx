import { GithubLogo, LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <Link href="/" className="font-bold text-[15px] text-ink tracking-tight">
              dat.ngo
            </Link>
            <p className="text-xs text-ink-muted mt-1">
              Spatial Computing · WebAR/XR · AI · Founder
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/datngo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-ink-muted hover:text-ink transition-colors"
            >
              <GithubLogo size={18} />
            </a>
            <a
              href="https://linkedin.com/in/datngo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-ink-muted hover:text-ink transition-colors"
            >
              <LinkedinLogo size={18} />
            </a>
            <a
              href="mailto:dat@realitech.dev"
              aria-label="Email"
              className="text-ink-muted hover:text-ink transition-colors"
            >
              <EnvelopeSimple size={18} />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-muted">
          <p>© {year} Nguyễn Phạm Quốc Đạt. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/blog" className="hover:text-ink transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
            <Link href="/contact" className="hover:text-ink transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
