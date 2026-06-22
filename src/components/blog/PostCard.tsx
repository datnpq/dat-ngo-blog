import Link from "next/link";
import Image from "next/image";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import type { PostListItem } from "@/types/post";

interface PostCardProps {
  post: PostListItem;
  featured?: boolean;
}

const tagGradients: Record<string, string> = {
  "spatial computing": "from-violet-100 to-indigo-50",
  "webAR": "from-violet-100 to-indigo-50",
  "xr": "from-violet-100 to-indigo-50",
  "ar": "from-violet-100 to-indigo-50",
  "ai": "from-sky-100 to-cyan-50",
  "machine learning": "from-sky-100 to-cyan-50",
  "engineering": "from-slate-100 to-blue-50",
  "architecture": "from-slate-100 to-blue-50",
  "system": "from-slate-100 to-blue-50",
  "founder": "from-amber-100 to-orange-50",
  "startup": "from-amber-100 to-orange-50",
};

function getGradient(tags: string[]): string {
  const first = (tags[0] ?? "").toLowerCase();
  for (const [key, value] of Object.entries(tagGradients)) {
    if (first.includes(key)) return value;
  }
  return "from-neutral-100 to-stone-50";
}

function formatDate(date: Date) {
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const gradient = getGradient(post.tags);

  if (featured) {
    return (
      <article className="group mb-10 pb-10 border-b border-border">
        {/* Cover image / gradient */}
        <Link href={`/blog/${post.slug}`} className="block mb-5 overflow-hidden rounded-2xl aspect-[2/1] bg-gradient-to-br border border-border">
          {post.featuredImageUrl ? (
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} dark:opacity-40 flex items-end p-6`}>
              <div className="flex gap-2">
                {post.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-xs font-medium text-ink-secondary bg-white/70 px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Link>

        {/* Content */}
        {post.tags[0] && (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">
            {post.tags[0]}
          </span>
        )}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors leading-tight mb-3">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-ink-secondary leading-relaxed mb-4 line-clamp-2 text-[15px]">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2.5 text-xs text-ink-muted">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
            ĐN
          </div>
          <span className="text-ink-secondary font-medium">Nguyễn Phạm Quốc Đạt</span>
          <span>·</span>
          <time>{formatDate(post.publishedAt)}</time>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.readingTimeMinutes} phút
          </span>
        </div>
      </article>
    );
  }

  /* Regular card — image right, text left */
  return (
    <article className="group py-6 border-b border-border last:border-0 flex gap-5">
      {/* Text */}
      <div className="flex-1 min-w-0">
        {post.tags[0] && (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1.5 block">
            {post.tags[0]}
          </span>
        )}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-[17px] font-bold text-ink group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-ink-secondary text-sm leading-relaxed line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <time>{formatDate(post.publishedAt)}</time>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.readingTimeMinutes} phút đọc
          </span>
        </div>
      </div>

      {/* Thumbnail */}
      <Link
        href={`/blog/${post.slug}`}
        className="shrink-0 w-28 sm:w-36 h-20 sm:h-24 rounded-xl overflow-hidden border border-border"
      >
        {post.featuredImageUrl ? (
          <Image
            src={post.featuredImageUrl}
            alt={post.title}
            width={200}
            height={120}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} dark:opacity-40`} />
        )}
      </Link>
    </article>
  );
}
