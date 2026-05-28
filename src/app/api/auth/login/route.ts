import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabaseClient";
import { isBlocked, recordAttempt, clearAttempts } from "@/db/rateLimits";
import { createSession, generateSessionToken } from "@/db/sessions";
import { setSessionCookie } from "@/lib/auth";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    const blocked = await isBlocked(ip);
    if (blocked) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { data: authorRecord } = await supabase
      .from("author")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .limit(1)
      .single();

    const validCredentials =
      authorRecord && (await bcrypt.compare(password, authorRecord.password_hash));

    if (!validCredentials) {
      await recordAttempt(ip);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await clearAttempts(ip);

    const token = generateSessionToken();
    await createSession(token);

    const { name, value, options } = setSessionCookie(token);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(name, value, options);
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[login]", msg);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
