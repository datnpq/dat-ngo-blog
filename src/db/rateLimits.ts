import { supabase } from "@/lib/supabaseClient";

const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 5;

function getCurrentWindowStart(): string {
  const now = Date.now();
  const windowMs = WINDOW_MINUTES * 60 * 1000;
  return new Date(Math.floor(now / windowMs) * windowMs).toISOString();
}

export async function recordAttempt(ip: string): Promise<void> {
  await supabase.from("rate_limit_attempts").insert({
    ip_address: ip,
    window_start: getCurrentWindowStart(),
    attempted_at: new Date().toISOString(),
  });
}

export async function getAttemptCount(ip: string): Promise<number> {
  const windowStart = getCurrentWindowStart();
  const { count } = await supabase
    .from("rate_limit_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("window_start", windowStart);
  return count ?? 0;
}

export async function isBlocked(ip: string): Promise<boolean> {
  return (await getAttemptCount(ip)) >= MAX_ATTEMPTS;
}

export async function clearAttempts(ip: string): Promise<void> {
  await supabase.from("rate_limit_attempts").delete().eq("ip_address", ip);
}
