import { supabase } from "@/lib/supabaseClient";

export type AddSubscriberResult = "added" | "reactivated" | "exists";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function addSubscriber(
  email: string,
  source?: string
): Promise<AddSubscriberResult> {
  const normalized = normalizeEmail(email);

  const { data: rows } = await supabase
    .from("subscribers")
    .select("id, status")
    .eq("email", normalized)
    .limit(1);

  const existing = rows?.[0];
  if (existing) {
    if (existing.status !== "active") {
      await supabase
        .from("subscribers")
        .update({ status: "active" })
        .eq("id", existing.id);
      return "reactivated";
    }
    return "exists";
  }

  const { error } = await supabase.from("subscribers").insert({
    email: normalized,
    status: "active",
    source: source ?? null,
  });
  if (error) throw new Error(error.message);
  return "added";
}

export async function getActiveSubscriberCount(): Promise<number> {
  const { count } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");
  return count ?? 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function listSubscribers(): Promise<any[]> {
  const { data } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
