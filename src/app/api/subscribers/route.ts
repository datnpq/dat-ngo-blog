import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { listSubscribers, getActiveSubscriberCount } from "@/db/subscribers";

export async function GET() {
  const { valid } = await getSessionFromRequest();
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [subscribers, activeCount] = await Promise.all([
      listSubscribers(),
      getActiveSubscriberCount(),
    ]);
    return NextResponse.json({ subscribers, activeCount });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
