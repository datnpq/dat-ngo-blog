import type { Metadata } from "next";
import { getPublishedPosts } from "@/db/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/blog/Pagination";
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

const topics = ["Tất cả", "Spatial Computing", "WebAR / XR", "AI", "Engineering", "Founder"];

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogListPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  let posts: Awaited<ReturnType<typeof getPublishedPosts>>["posts"] = [];
  let totalPages = 1;

  try {
    const result = await getPublishedPosts(currentPage);
    posts = result.posts;
    totalPages = result.totalPages;
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

          {/* Topic pills */}
          <div className="flex flex-wrap gap-2 mt-5">
            {topics.map((t) => (
              <span
                key={t}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-default ${
                  t === "Tất cả"
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-500 border-[#E9E9E9]"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        {/* Post list */}
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-neutral-400 text-sm">Chưa có bài viết nào.</p>
            <p className="text-neutral-300 text-xs mt-1">Quay lại sớm nhé!</p>
          </div>
        ) : (
          <div>
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                featured={index === 0 && currentPage === 1}
              />
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
