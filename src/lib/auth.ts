import { cookies } from "next/headers";
import { getSession, updateSessionActivity } from "@/db/sessions";

const COOKIE_NAME = "session_token";

export async function getSessionFromRequest(): Promise<{
  valid: boolean;
  token?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return { valid: false };

  const session = await getSession(token);
  if (!session) return { valid: false };

  await updateSessionActivity(token);
  return { valid: true, token };
}

export function setSessionCookie(token: string): {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict";
    maxAge: number;
    path: string;
  };
} {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    },
  };
}

export { COOKIE_NAME };
