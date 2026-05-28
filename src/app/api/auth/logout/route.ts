import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/db/sessions";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      await deleteSession(token);
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
