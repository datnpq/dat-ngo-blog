import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Clock } from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "@/components/seo/JsonLd";
import { NewsletterCTA } from "@/components/ui/NewsletterCTA";
import { getPopularPosts } from "@/db/posts";

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

export default async function HomePage() {
  let popular: Awaited<ReturnType<typeof getPopularPosts>> = [];
  try {
    popular = await getPopularPosts(4);
  } catch {
    // DB unavailable
  }

  return (
    <>
      <JsonLd data={personJsonLd} />
      <JsonLd data={websiteJsonLd} />

      <div className="max-w-4xl mx-auto px-5">
        {/* Hero — newsletter-style publication header */}
        <section className="py-14 sm:py-20 border-b border-[#E9E9E9]">
          <div className="max-w-2xl">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                ĐN
              </div>
              <div>
                <p className="font-semibold text-neutral-900 text-sm">Nguyễn Phạm Quốc Đạt</p>
                <p className="text-neutral-500 text-xs">Co-Founder @ REALITECH · Founder @ WeDev</p>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4 tracking-tight leading-[1.15]">
              dat.ngo
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-lg">
              Viết về Spatial Computing, WebAR/XR, AI applications, System Architecture và hành trình xây dựng startup ở Đông Nam Á.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors"
              >
                Đọc blog
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E9E9E9] text-neutral-700 rounded-xl text-sm font-medium hover:border-neutral-300 hover:bg-neutral-50 transition-all"
              >
                Về tác giả
              </Link>
            </div>
          </div>
        </section>

        {/* Topics */}
        <section className="py-10 border-b border-[#E9E9E9]">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">Chủ đề</p>
          <div className="flex flex-wrap gap-2">
            {topics.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="px-4 py-2 bg-white border border-[#E9E9E9] text-sm text-neutral-600 rounded-full hover:border-neutral-300 hover:text-neutral-900 transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* Popular posts */}
        {popular.length > 0 && (
          <section className="py-10 border-b border-[#E9E9E9]">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">Bài đọc nhiều</p>
            <div className="flex flex-col">
              {popular.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex items-baseline justify-between gap-4 py-2.5 border-b border-[#F0F0EE] last:border-0"
                >
                  <span className="text-sm text-neutral-700 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {p.title}
                  </span>
                  <span className="flex items-center gap-3 text-xs text-neutral-400 shrink-0">
                    <span className="flex items-center gap-1">
                      <Eye size={11} />
                      {p.views.toLocaleString("vi-VN")}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Clock size={11} />
                      {p.readingTimeMinutes}'
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="py-10 border-b border-[#E9E9E9]">
          <NewsletterCTA variant="homepage" />
        </section>

        {/* Quick links */}
        <section className="py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-5">Liên hệ</p>
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
                className="group flex items-center justify-between px-4 py-3 bg-white border border-[#E9E9E9] rounded-xl text-sm text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 transition-all"
              >
                <span>{label}</span>
                <ArrowRight size={13} className="text-neutral-300 group-hover:text-neutral-600 transition-colors" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
