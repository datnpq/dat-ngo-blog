import { supabase } from "@/lib/supabaseClient";
import crypto from "crypto";

const SESSION_TTL_HOURS = 24;

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(token: string): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_HOURS * 3600 * 1000);
  await supabase.from("sessions").insert({
    session_token: token,
    expires_at: expiresAt.toISOString(),
    created_at: now.toISOString(),
    last_active_at: now.toISOString(),
  });
}

export async function getSession(token: string) {
  const { data } = await supabase
    .from("sessions")
    .select("*")
    .eq("session_token", token)
    .limit(1)
    .single();

  if (!data) return null;

  const now = new Date();
  const lastActive = new Date(data.last_active_at);
  const hoursSinceActive = (now.getTime() - lastActive.getTime()) / 3600000;

  if (hoursSinceActive >= SESSION_TTL_HOURS) {
    await deleteSession(token);
    return null;
  }

  return data;
}

export async function updateSessionActivity(token: string): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_HOURS * 3600 * 1000);
  await supabase
    .from("sessions")
    .update({ last_active_at: now.toISOString(), expires_at: expiresAt.toISOString() })
    .eq("session_token", token);
}

export async function deleteSession(token: string): Promise<void> {
  await supabase.from("sessions").delete().eq("session_token", token);
}

export async function cleanExpiredSessions(): Promise<void> {
  await supabase.from("sessions").delete().lt("expires_at", new Date().toISOString());
}
