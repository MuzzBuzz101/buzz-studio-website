import { NextResponse } from "next/server";
import { getAvailabilityPayload } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getAvailabilityPayload());
}
