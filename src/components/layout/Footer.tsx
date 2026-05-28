import { GithubLogo, LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E9E9E9] bg-white mt-auto">
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <Link href="/" className="font-bold text-[15px] text-neutral-900 tracking-tight">
              dat.ngo
            </Link>
            <p className="text-xs text-neutral-400 mt-1">
              Spatial Computing · WebAR/XR · AI · Founder
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/datngo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              <GithubLogo size={18} />
            </a>
            <a
              href="https://linkedin.com/in/datngo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              <LinkedinLogo size={18} />
            </a>
            <a
              href="mailto:dat@realitech.dev"
              aria-label="Email"
              className="text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              <EnvelopeSimple size={18} />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#F0F0EE] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400">
          <p>© {year} Nguyễn Phạm Quốc Đạt. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/blog" className="hover:text-neutral-700 transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-neutral-700 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-neutral-700 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
