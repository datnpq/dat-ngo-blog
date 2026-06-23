import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getPostsByTag, getAllTags } from "@/db/posts";
import { PostCard } from "@/components/blog/PostCard";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  try {
    const tags = await getAllTags();
    return tags.map((t) => ({ tag: encodeURIComponent(t) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const title = `#${decoded} — dat.ngo`;
  const description = `Các bài viết về ${decoded} của Nguyễn Phạm Quốc Đạt.`;
  return {
    title,
    description,
    alternates: { canonical: `https://dat.ngo/tag/${tag}` },
    openGraph: { title, description, url: `https://dat.ngo/tag/${tag}`, type: "website" },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  let posts: Awaited<ReturnType<typeof getPostsByTag>> = [];
  try {
    posts = await getPostsByTag(decoded);
  } catch {
    /* DB unavailable */
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://dat.ngo" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://dat.ngo/blog" },
      { "@type": "ListItem", position: 3, name: decoded, item: `https://dat.ngo/tag/${tag}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="max-w-4xl mx-auto px-5 py-10 sm:py-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-700 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Tất cả bài viết
        </Link>

        <header className="mb-8 pb-8 border-b border-[#E9E9E9]">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Chủ đề</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            #{decoded}
          </h1>
          <p className="text-neutral-500 text-sm mt-2">
            {posts.length} bài viết
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="py-16 text-center text-neutral-400 text-sm">
            Chưa có bài viết nào với chủ đề này.
          </p>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
