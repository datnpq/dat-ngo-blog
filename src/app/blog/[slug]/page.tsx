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
import { getPostBySlug, getAllPublishedPostsForSitemap, getRelatedPosts, getAdjacentPosts } from "@/db/posts";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculateReadingTime } from "@/lib/content";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ScrollToTop } from "@/components/blog/ScrollToTop";
import { GiscusComments } from "@/components/blog/GiscusComments";
import { NewsletterCTA } from "@/components/ui/NewsletterCTA";
import { SubscribeModal } from "@/components/ui/SubscribeModal";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { PostCard } from "@/components/blog/PostCard";
import { SupportCTA } from "@/components/ui/SupportCTA";
import { CodeCopyButtons } from "@/components/blog/CodeCopyButtons";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

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

  const relatedPosts = await getRelatedPosts(post.slug, post.tags, 3);
  const { prev, next } = await getAdjacentPosts(post.slug);

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
      <SubscribeModal />
      <CodeCopyButtons />

      {/* Reading container — narrower than site max for focus */}
      <div className="max-w-[740px] mx-auto px-5 py-10 sm:py-14">

        {/* Back nav */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-700 transition-colors mb-10"
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
                  className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-[2.4rem] font-bold text-neutral-900 mb-6 tracking-tight leading-[1.2]">
            {post.title}
          </h1>

          {/* Author row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[12px] font-bold text-white shrink-0 select-none">
              ĐN
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800 leading-none mb-1">
                Nguyễn Phạm Quốc Đạt
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
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
          <div className="mb-10 rounded-2xl overflow-hidden border border-[#E9E9E9] aspect-[2/1]">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        <hr className="border-[#E9E9E9] mb-10" />

        {/* ── Table of contents (auto, long posts only) ── */}
        <TableOfContents />

        {/* ── Article body ── */}
        <div
          className="article-prose prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* ── Share ── */}
        <div className="mt-10 pt-6 border-t border-[#E9E9E9]">
          <ShareButtons title={post.title} url={canonicalUrl} />
        </div>

        <hr className="border-[#E9E9E9] mt-10 mb-10" />

        {/* ── Newsletter ── */}
        <NewsletterCTA variant="post" />

        {/* ── Support / tip (renders only if env links set) ── */}
        <SupportCTA />

        {/* ── Related posts ── */}
        {relatedPosts.length > 0 && (
          <section className="mt-12 pt-10 border-t border-[#E9E9E9]">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">Bài liên quan</h2>
            <div className="grid sm:grid-cols-2 gap-x-6">
              {relatedPosts.map((rp) => (
                <PostCard key={rp.id} post={rp} />
              ))}
            </div>
          </section>
        )}

        {/* ── Comments ── */}
        <GiscusComments slug={post.slug} />

        {/* ── Author card ── */}
        <div className="flex gap-5 p-6 bg-white border border-[#E9E9E9] rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[15px] font-bold text-white shrink-0 select-none">
            ĐN
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-neutral-900 mb-0.5">Nguyễn Phạm Quốc Đạt</p>
            <p className="text-xs text-neutral-400 mb-3">
              Co-Founder @ REALITECH · Founder @ WeDev
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed mb-4">
              Xây dựng nền tảng WebAR no-code cho SMEs/enterprises tại Đông Nam Á.
              Viết về Spatial Computing, System Architecture, AI và hành trình Founder.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:dat@realitech.dev"
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <Envelope size={13} /> Email
              </a>
              <a
                href="https://linkedin.com/in/datngo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <LinkedinLogo size={13} /> LinkedIn
              </a>
              <a
                href="https://github.com/datngo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <GithubLogo size={13} /> GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <nav className="mt-10 grid sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group p-4 border border-[#E9E9E9] rounded-2xl hover:border-neutral-300 transition-colors"
              >
                <span className="flex items-center gap-1 text-xs text-neutral-400 mb-1">
                  <ArrowLeft size={12} /> Bài mới hơn
                </span>
                <span className="text-sm font-semibold text-neutral-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="group p-4 border border-[#E9E9E9] rounded-2xl hover:border-neutral-300 transition-colors text-right"
              >
                <span className="flex items-center justify-end gap-1 text-xs text-neutral-400 mb-1">
                  Bài cũ hơn <ArrowRight size={12} />
                </span>
                <span className="text-sm font-semibold text-neutral-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        )}

        {/* Back nav */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <ArrowLeft size={14} />
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </>
  );
}
