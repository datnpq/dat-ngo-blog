import { NextRequest, NextResponse } from "next/server";
import { incrementPostViews } from "@/db/posts";

export async function POST(req: NextRequest) {
  try {
    const { slug } = (await req.json()) as { slug?: unknown };
    if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "bad slug" }, { status: 422 });
    }
    await incrementPostViews(slug);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
