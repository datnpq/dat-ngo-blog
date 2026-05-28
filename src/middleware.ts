import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "session_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Token presence check only — full session validation happens in API routes/pages
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
