import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/db/subscribers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: unknown; source?: unknown };
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 422 });
    }

    const source =
      typeof body.source === "string" ? body.source.slice(0, 40) : undefined;

    const result = await addSubscriber(email, source);
    return NextResponse.json({ ok: true, result });
  } catch {
    return NextResponse.json({ error: "Có lỗi xảy ra, thử lại sau." }, { status: 500 });
  }
}
