import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarBlank,
  Clock,
  ArrowLeft,
  Envelope,
  LinkedinLogo,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr";
import { getPostBySlug, getAllPublishedPostsForSitemap } from "@/db/posts";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculateReadingTime } from "@/lib/content";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ScrollToTop } from "@/components/blog/ScrollToTop";
import { GiscusComments } from "@/components/blog/GiscusComments";
import { NewsletterCTA } from "@/components/ui/NewsletterCTA";
import { MotionFigure } from "@/components/ui/MotionFigure";

export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPublishedPostsForSitemap();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

function buildOgImage(post: { title: string; seoTitle?: string | null; featuredImageUrl?: string | null; tags?: string[] }) {
  const ogParams = new URLSearchParams({
    title: post.seoTitle || post.title,
    subtitle: "Nguyễn Phạm Quốc Đạt",
    ...(post.tags?.length ? { tags: post.tags.slice(0, 3).join(",") } : {}),
  });
  return post.featuredImageUrl || `https://dat.ngo/og?${ogParams}`;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const description =
    post.seoDescription ||
    post.excerpt ||
    post.body.replace(/<[^>]+>/g, "").slice(0, 160);
  const ogImage = buildOgImage(post);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dat.ngo";
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.seoTitle || post.title,
    description,
    openGraph: {
      title: post.seoTitle || post.title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      locale: "vi_VN",
      authors: ["Nguyễn Phạm Quốc Đạt"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dat.ngo";
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const ogImage = buildOgImage(post);
  const readingTime = calculateReadingTime(post.body.replace(/<[^>]+>/g, ""));

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    author: {
      "@type": "Person",
      name: "Nguyễn Phạm Quốc Đạt",
      url: "https://dat.ngo",
      jobTitle: "Co-Founder at REALITECH & Founder at WeDev",
    },
    publisher: {
      "@type": "Person",
      name: "Nguyễn Phạm Quốc Đạt",
      url: "https://dat.ngo",
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    image: ogImage,
    url: canonicalUrl,
    inLanguage: post.language === "en" ? "en" : "vi",
    keywords: post.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://dat.ngo" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://dat.ngo/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ReadingProgress />
      <ScrollToTop />

      {/* Reading container — narrower than site max for focus */}
      <div className="max-w-[740px] mx-auto px-5 py-10 sm:py-14">

        {/* Back nav */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Blog
        </Link>

        {/* ── Article header ── */}
        <header className="mb-8">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-[2.4rem] font-bold text-ink mb-6 tracking-tight leading-[1.2]">
            {post.title}
          </h1>

          {/* Author row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[12px] font-bold text-white shrink-0 select-none">
              ĐN
            </div>
            <div>
              <p className="text-sm font-semibold text-ink leading-none mb-1">
                Nguyễn Phạm Quốc Đạt
              </p>
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                {formattedDate && (
                  <>
                    <span className="flex items-center gap-1">
                      <CalendarBlank size={11} />
                      <time dateTime={post.publishedAt?.toISOString()}>{formattedDate}</time>
                    </span>
                    <span>·</span>
                  </>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {readingTime} phút đọc
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured image */}
        {post.featuredImageUrl && (
          <MotionFigure className="mb-10 rounded-2xl overflow-hidden border border-border aspect-[2/1]">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </MotionFigure>
        )}

        <hr className="border-border mb-10" />

        {/* ── Article body ── */}
        <div
          className="article-prose prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        <hr className="border-border mt-12 mb-10" />

        {/* ── Newsletter ── */}
        <NewsletterCTA variant="post" />

        {/* ── Comments ── */}
        <GiscusComments slug={post.slug} />

        {/* ── Author card ── */}
        <div className="flex gap-5 p-6 bg-card border border-border rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[15px] font-bold text-white shrink-0 select-none">
            ĐN
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-ink mb-0.5">Nguyễn Phạm Quốc Đạt</p>
            <p className="text-xs text-ink-muted mb-3">
              Co-Founder @ REALITECH · Founder @ WeDev
            </p>
            <p className="text-sm text-ink-secondary leading-relaxed mb-4">
              Xây dựng nền tảng WebAR no-code cho SMEs/enterprises tại Đông Nam Á.
              Viết về Spatial Computing, System Architecture, AI và hành trình Founder.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:dat@realitech.dev"
                className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
              >
                <Envelope size={13} /> Email
              </a>
              <a
                href="https://linkedin.com/in/datngo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
              >
                <LinkedinLogo size={13} /> LinkedIn
              </a>
              <a
                href="https://github.com/datngo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
              >
                <GithubLogo size={13} /> GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Back nav */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} />
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </>
  );
}
