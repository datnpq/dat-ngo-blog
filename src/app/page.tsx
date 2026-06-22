import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "@/components/seo/JsonLd";
import { NewsletterCTA } from "@/components/ui/NewsletterCTA";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "dat.ngo — Nguyễn Phạm Quốc Đạt",
  description:
    "Blog của Nguyễn Phạm Quốc Đạt — Co-Founder @ REALITECH, Founder @ WeDev. Viết về Spatial Computing, WebAR/XR, System Architecture, AI applications và hành trình Founder.",
  openGraph: {
    title: "dat.ngo — Nguyễn Phạm Quốc Đạt",
    description:
      "Blog của Nguyễn Phạm Quốc Đạt — Co-Founder @ REALITECH & Founder @ WeDev.",
    url: "https://dat.ngo",
    type: "website",
    images: [{ url: "https://dat.ngo/og" }],
  },
  alternates: { canonical: "https://dat.ngo" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nguyễn Phạm Quốc Đạt",
  url: "https://dat.ngo",
  image: "https://dat.ngo/og",
  jobTitle: "Co-Founder at REALITECH & Founder at WeDev",
  email: "dat@realitech.dev",
  knowsAbout: ["WebAR", "Spatial Computing", "System Architecture", "AI", "Full-stack development"],
  sameAs: [
    "https://linkedin.com/in/datngo",
    "https://github.com/datngo",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "dat.ngo",
  url: "https://dat.ngo",
  description: "Blog của Nguyễn Phạm Quốc Đạt về Spatial Computing, AI và hành trình Founder",
  inLanguage: "vi",
  author: { "@type": "Person", name: "Nguyễn Phạm Quốc Đạt" },
};

const topics = [
  { label: "Spatial Computing", href: "/blog" },
  { label: "WebAR / XR", href: "/blog" },
  { label: "AI Applications", href: "/blog" },
  { label: "System Architecture", href: "/blog" },
  { label: "Founder Diary", href: "/blog" },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={personJsonLd} />
      <JsonLd data={websiteJsonLd} />

      <div className="max-w-4xl mx-auto px-5">
        {/* Hero — newsletter-style publication header */}
        <section className="py-14 sm:py-20 border-b border-border">
          <div className="max-w-2xl">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                ĐN
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">Nguyễn Phạm Quốc Đạt</p>
                <p className="text-ink-secondary text-xs">Co-Founder @ REALITECH · Founder @ WeDev</p>
              </div>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-bold text-ink mb-4 tracking-tight leading-[1.15] animate-fade-in-up"
              style={{ animationDelay: "80ms" }}
            >
              dat.ngo
            </h1>
            <p
              className="text-lg text-ink-secondary leading-relaxed mb-8 max-w-lg animate-fade-in-up"
              style={{ animationDelay: "160ms" }}
            >
              Viết về Spatial Computing, WebAR/XR, AI applications, System Architecture và hành trình xây dựng startup ở Đông Nam Á.
            </p>

            <div
              className="flex flex-wrap gap-3 animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-surface rounded-xl text-sm font-semibold hover:bg-ink-secondary transition-colors"
              >
                Đọc blog
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-ink-secondary rounded-xl text-sm font-medium hover:border-border-hover hover:bg-elevated transition-all"
              >
                Về tác giả
              </Link>
            </div>
          </div>
        </section>

        {/* Topics */}
        <Reveal>
          <section className="py-10 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Chủ đề</p>
            <div className="flex flex-wrap gap-2">
              {topics.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-4 py-2 bg-card border border-border text-sm text-ink-secondary rounded-full hover:border-border-hover hover:text-ink hover:-translate-y-0.5 transition-all"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Newsletter */}
        <Reveal>
          <section className="py-10 border-b border-border">
            <NewsletterCTA variant="homepage" />
          </section>
        </Reveal>

        {/* Quick links */}
        <Reveal>
          <section className="py-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-5">Liên hệ</p>
            <div className="flex flex-col gap-3 max-w-md">
            {[
              { label: "dat@realitech.dev", href: "mailto:dat@realitech.dev" },
              { label: "LinkedIn — /in/datngo", href: "https://linkedin.com/in/datngo" },
              { label: "GitHub — /datngo", href: "https://github.com/datngo" },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl text-sm text-ink-secondary hover:border-border-hover hover:text-ink transition-all"
              >
                <span>{label}</span>
                <ArrowRight size={13} className="text-ink-muted group-hover:text-ink transition-colors" />
              </a>
            ))}
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
