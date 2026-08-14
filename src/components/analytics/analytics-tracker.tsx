"use client";

/**
 * Lightweight public analytics tracker.
 * Fires pageview on mount / route change; sets bs_vid via API response cookie.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function track(
  event: "pageview" | "visit" | "video_view",
  payload?: { path?: string; videoId?: string; slug?: string }
) {
  try {
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...payload }),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}

/** Call from video play handlers (case study, reel modal, etc.). */
export function trackVideoView(opts: {
  slug?: string;
  videoId?: string;
  path?: string;
}) {
  track("video_view", opts);
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Skip admin surfaces
    if (pathname.startsWith("/admin")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    track("pageview", { path: pathname });
  }, [pathname]);

  return null;
}
