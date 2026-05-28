import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getPostById, updatePost, deletePost, isSlugTaken } from "@/db/posts";
import { sanitizeHtml } from "@/lib/sanitize";
import { isValidSlug } from "@/lib/slug";
import type { UpdatePostInput } from "@/types/post";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { valid } = await getSessionFromRequest();
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { valid } = await getSessionFromRequest();
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json() as Partial<UpdatePostInput>;

    if (body.title !== undefined && !body.title.trim()) {
      return NextResponse.json({ error: "Title cannot be empty", field: "title" }, { status: 422 });
    }
    if (body.body !== undefined && !body.body.trim()) {
      return NextResponse.json({ error: "Body cannot be empty", field: "body" }, { status: 422 });
    }
    if (body.slug !== undefined && !isValidSlug(body.slug)) {
      return NextResponse.json({ error: "Invalid slug format", field: "slug" }, { status: 422 });
    }
    if (body.slug) {
      const slugTaken = await isSlugTaken(body.slug, id);
      if (slugTaken) {
        return NextResponse.json({ error: "Slug already exists", field: "slug" }, { status: 422 });
      }
    }

    const updateData: UpdatePostInput = {
      ...body,
      ...(body.body && { body: sanitizeHtml(body.body) }),
    };

    const post = await updatePost(id, updateData);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { valid } = await getSessionFromRequest();
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deleted = await deletePost(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
