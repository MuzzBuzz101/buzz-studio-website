"use client";

import dynamic from "next/dynamic";
import { Play } from "lucide-react";
import { trackVideoView } from "@/components/analytics/analytics-tracker";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const VideoPlayer = dynamic(
  () => import("@/components/ui/video-player").then((m) => m.VideoPlayer),
  { ssr: false }
);

interface VideoModalProps {
  src?: string;
  poster?: string;
  triggerLabel?: string;
  className?: string;
  /** Analytics id when the reel opens (e.g. hero-reel). */
  trackId?: string;
}

export function VideoModal({
  src,
  poster,
  triggerLabel = "Play Full Reel",
  className,
  trackId = "hero-reel",
}: VideoModalProps) {
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open && src) {
          trackVideoView({
            slug: trackId,
            videoId: src,
            path:
              typeof window !== "undefined"
                ? window.location.pathname
                : undefined,
          });
        }
      }}
    >
      <DialogTrigger
        data-cursor="view"
        className={cn(
          "group inline-flex items-center gap-4 rounded-full border border-white/25 py-2 pl-2 pr-6 text-sm font-medium text-white transition-all duration-500 hover:border-white/60 hover:bg-white/5",
          className
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-obsidian-950 transition-transform duration-500 group-hover:scale-110">
          <Play className="h-4 w-4 pl-0.5" />
        </span>
        <span className="tracking-wide">{triggerLabel}</span>
      </DialogTrigger>
      <DialogContent>
        <VideoPlayer
          src={src}
          poster={poster}
          autoPlay
          className="aspect-video w-full"
        />
      </DialogContent>
    </Dialog>
  );
}
