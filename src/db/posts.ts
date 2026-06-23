import { supabase } from "@/lib/supabaseClient";
import type { Post, PostListItem, CreatePostInput, UpdatePostInput } from "@/types/post";
import { calculateReadingTime, truncateExcerpt } from "@/lib/content";

const PAGE_SIZE = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToPost(row: any): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    body: row.body,
    excerpt: row.excerpt ?? null,
    tags: row.tags ?? [],
    featuredImageUrl: row.featured_image_url ?? null,
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    language: row.language ?? "vi",
    status: row.status,
    publishedAt: row.published_at ? new Date(row.published_at) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToPostListItem(row: any): PostListItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ? truncateExcerpt(row.excerpt) : null,
    tags: row.tags ?? [],
    featuredImageUrl: row.featured_image_url ?? null,
    language: row.language ?? "vi",
    publishedAt: new Date(row.published_at),
    readingTimeMinutes: calculateReadingTime(row.body),
  };
}

export async function getPublishedPosts(
  page = 1,
  pageSize = PAGE_SIZE
): Promise<{ posts: PostListItem[]; total: number; totalPages: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const [{ data: rows }, { count }] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(from, to),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
  ]);

  const total = count ?? 0;
  return {
    posts: (rows ?? []).map(mapToPostListItem),
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1)
    .single();
  return data ? mapToPost(data) : null;
}

export async function getAllPostsForAdmin(): Promise<Post[]> {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapToPost);
}

export async function getPostById(id: string): Promise<Post | null> {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();
  return data ? mapToPost(data) : null;
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  let query = supabase.from("posts").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query.limit(1);
  return (data?.length ?? 0) > 0;
}

export async function createPost(data: CreatePostInput): Promise<Post> {
  const now = new Date().toISOString();
  const { data: row, error } = await supabase
    .from("posts")
    .insert({
      title: data.title,
      slug: data.slug,
      body: data.body,
      excerpt: data.excerpt ?? null,
      tags: data.tags ?? [],
      featured_image_url: data.featuredImageUrl ?? null,
      seo_title: data.seoTitle ?? null,
      seo_description: data.seoDescription ?? null,
      language: data.language ?? "vi",
      status: data.status ?? "draft",
      published_at:
        data.status === "published" ? (data.publishedAt?.toISOString() ?? now) : null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapToPost(row);
}

export async function updatePost(id: string, data: UpdatePostInput): Promise<Post | null> {
  const existing = await getPostById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  let publishedAt: string | null = existing.publishedAt?.toISOString() ?? null;

  if (data.status === "published" && !existing.publishedAt) {
    publishedAt = data.publishedAt?.toISOString() ?? now;
  } else if (data.status === "draft") {
    publishedAt = null;
  }

  const updates: Record<string, unknown> = { updated_at: now };
  if (data.title !== undefined) updates.title = data.title;
  if (data.slug !== undefined) updates.slug = data.slug;
  if (data.body !== undefined) updates.body = data.body;
  if (data.excerpt !== undefined) updates.excerpt = data.excerpt;
  if (data.tags !== undefined) updates.tags = data.tags;
  if (data.featuredImageUrl !== undefined) updates.featured_image_url = data.featuredImageUrl;
  if (data.seoTitle !== undefined) updates.seo_title = data.seoTitle;
  if (data.seoDescription !== undefined) updates.seo_description = data.seoDescription;
  if (data.language !== undefined) updates.language = data.language;
  if (data.status !== undefined) updates.status = data.status;
  updates.published_at = publishedAt;

  const { data: row, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return row ? mapToPost(row) : null;
}

export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  return !error;
}

export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3
): Promise<PostListItem[]> {
  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .neq("slug", currentSlug);

  if (tags.length > 0) {
    query = query.overlaps("tags", tags);
  }

  const { data } = await query
    .order("published_at", { ascending: false })
    .limit(limit);

  let posts = (data ?? []).map(mapToPostListItem);

  // Fallback: if not enough tag matches, fill with most recent posts
  if (posts.length < limit) {
    const { data: recent } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .neq("slug", currentSlug)
      .order("published_at", { ascending: false })
      .limit(limit + 1);
    const seen = new Set(posts.map((p) => p.slug));
    for (const row of recent ?? []) {
      if (posts.length >= limit) break;
      if (!seen.has(row.slug)) {
        posts.push(mapToPostListItem(row));
        seen.add(row.slug);
      }
    }
  }

  return posts.slice(0, limit);
}

export async function getAllPublishedPostsForSitemap(): Promise<
  Array<{ slug: string; updatedAt: Date }>
> {
  const { data } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data ?? []).map((row) => ({ slug: row.slug, updatedAt: new Date(row.updated_at) }));
}
