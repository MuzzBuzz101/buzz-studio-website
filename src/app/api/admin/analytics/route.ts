import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/admin-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const analytics = await getAnalyticsSummary();
    return NextResponse.json({ analytics });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load analytics.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
