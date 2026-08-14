import { NextResponse } from "next/server";
import {
  recordAnalyticsEvent,
  type AnalyticsEventType,
} from "@/lib/admin-store";
import {
  ANALYTICS_VID_COOKIE,
  ANALYTICS_VID_MAX_AGE,
} from "@/lib/admin-types";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const VALID_EVENTS: AnalyticsEventType[] = [
  "pageview",
  "visit",
  "video_view",
];

function newVisitorId(): string {
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`analytics:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body: {
    event?: string;
    path?: string;
    videoId?: string;
    slug?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const event = body.event as AnalyticsEventType | undefined;
  if (!event || !VALID_EVENTS.includes(event)) {
    return NextResponse.json(
      { error: "event must be pageview | visit | video_view." },
      { status: 400 }
    );
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${ANALYTICS_VID_COOKIE}=([^;]+)`)
  );
  const existingVid = match?.[1] ? decodeURIComponent(match[1]) : "";
  const visitorId = existingVid || newVisitorId();

  try {
    const result = await recordAnalyticsEvent({
      type: event,
      visitorId,
      path: typeof body.path === "string" ? body.path.slice(0, 200) : undefined,
      videoId:
        typeof body.videoId === "string" ? body.videoId.slice(0, 120) : undefined,
      slug: typeof body.slug === "string" ? body.slug.slice(0, 120) : undefined,
    });

    const res = NextResponse.json({
      ok: true,
      isNewVisitor: result.isNewVisitor,
    });

    if (!existingVid) {
      res.cookies.set(ANALYTICS_VID_COOKIE, result.visitorId, {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ANALYTICS_VID_MAX_AGE,
      });
    }

    return res;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to record analytics.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
