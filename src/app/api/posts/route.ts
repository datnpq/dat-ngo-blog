import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getAllPostsForAdmin, createPost, isSlugTaken } from "@/db/posts";
import { sanitizeHtml } from "@/lib/sanitize";
import { isValidSlug } from "@/lib/slug";
import type { CreatePostInput } from "@/types/post";

export async function GET() {
  const { valid } = await getSessionFromRequest();
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const posts = await getAllPostsForAdmin();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { valid } = await getSessionFromRequest();
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json() as Partial<CreatePostInput>;

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required", field: "title" }, { status: 422 });
    }
    if (!body.body?.trim()) {
      return NextResponse.json({ error: "Body is required", field: "body" }, { status: 422 });
    }
    if (!body.slug || !isValidSlug(body.slug)) {
      return NextResponse.json({ error: "Invalid slug format", field: "slug" }, { status: 422 });
    }

    const slugTaken = await isSlugTaken(body.slug);
    if (slugTaken) {
      return NextResponse.json({ error: "Slug already exists", field: "slug" }, { status: 422 });
    }

    const post = await createPost({
      title: body.title.trim(),
      slug: body.slug,
      body: sanitizeHtml(body.body.trim()),
      excerpt: body.excerpt?.trim() || undefined,
      tags: body.tags,
      featuredImageUrl: body.featuredImageUrl,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      language: body.language,
      status: body.status,
      publishedAt: body.publishedAt,
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
