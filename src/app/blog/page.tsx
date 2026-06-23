import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getAllTags } from "@/db/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/blog/Pagination";
import { PostSearch } from "@/components/blog/PostSearch";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — dat.ngo",
  description:
    "Bài viết về Spatial Computing, WebAR/XR, System Architecture, AI applications và Founder Diary của Nguyễn Phạm Quốc Đạt.",
  openGraph: {
    title: "Blog — dat.ngo",
    description: "Bài viết chuyên sâu về Spatial Computing, WebAR/XR, System Architecture và AI.",
    url: "https://dat.ngo/blog",
    type: "website",
    images: [{ url: "https://dat.ngo/og" }],
  },
  alternates: { canonical: "https://dat.ngo/blog" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://dat.ngo" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://dat.ngo/blog" },
  ],
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogListPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  let posts: Awaited<ReturnType<typeof getPublishedPosts>>["posts"] = [];
  let totalPages = 1;
  let tags: string[] = [];

  try {
    const [result, allTags] = await Promise.all([
      getPublishedPosts(currentPage),
      getAllTags(),
    ]);
    posts = result.posts;
    totalPages = result.totalPages;
    tags = allTags;
  } catch {
    // DB unavailable
  }

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <div className="max-w-4xl mx-auto px-5 py-10 sm:py-14">
        {/* Header */}
        <header className="mb-8 pb-8 border-b border-[#E9E9E9]">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            Blog
          </h1>
          <p className="text-neutral-500 text-sm">
            Viết về Spatial Computing, AI, System Architecture và hành trình Founder.
          </p>

          {/* Topic pills — real tags linking to /tag/[tag] */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-medium border bg-neutral-900 text-white border-neutral-900">
                Tất cả
              </span>
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/tag/${encodeURIComponent(t)}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium border bg-white text-neutral-500 border-[#E9E9E9] hover:border-neutral-300 hover:text-neutral-900 transition-colors"
                >
                  {t}
                </Link>
              ))}
            </div>
          )}

          {/* Search */}
          {posts.length > 0 && <PostSearch />}
        </header>

        {/* Post list */}
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-neutral-400 text-sm">Chưa có bài viết nào.</p>
            <p className="text-neutral-300 text-xs mt-1">Quay lại sớm nhé!</p>
          </div>
        ) : (
          <>
            <div id="post-list">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="post-item"
                  data-search={`${post.title} ${post.excerpt ?? ""} ${post.tags.join(" ")}`.toLowerCase()}
                >
                  <PostCard post={post} featured={index === 0 && currentPage === 1} />
                </div>
              ))}
            </div>
            <p id="post-empty" style={{ display: "none" }} className="py-16 text-center text-neutral-400 text-sm">
              Không tìm thấy bài viết phù hợp.
            </p>
          </>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
