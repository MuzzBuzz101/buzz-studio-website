"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { VideoPlayer } from "@/components/ui/video-player";
import { cn } from "@/lib/utils";

interface LocalVideoEmbedProps {
  src: string;
  title: string;
  poster?: string;
  className?: string;
  /** Real aspect ratio of the video file. Defaults to "16:9". */
  aspect?: "16:9" | "9:16";
}

/**
 * Self-hosted equivalent of VimeoEmbed: the <video> element (and the file it
 * points to) is only mounted once the visitor clicks play, so a self-hosted
 * case-study file never blocks the initial page load.
 */
export function LocalVideoEmbed({ src, title, poster, className, aspect = "16:9" }: LocalVideoEmbedProps) {
  const [active, setActive] = useState(false);
  const isVertical = aspect === "9:16";

  if (active) {
    return (
      <VideoPlayer
        src={src}
        poster={poster}
        autoPlay
        className={cn(
          "w-full",
          isVertical ? "mx-auto aspect-[9/16] max-w-md" : "aspect-video",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black",
        isVertical ? "mx-auto aspect-[9/16] max-w-md" : "aspect-video",
        className
      )}
    >
      <button
        onClick={() => setActive(true)}
        data-cursor="view"
        data-cursor-text="Play"
        aria-label={`Play ${title}`}
        className="group absolute inset-0 h-full w-full"
      >
        {poster && (
          <Image
            src={poster}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover opacity-70 transition-opacity duration-700 group-hover:opacity-90"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-obsidian-950 transition-transform duration-500 ease-cinematic group-hover:scale-110">
            <Play className="h-6 w-6 pl-1" />
          </span>
        </span>
      </button>
    </div>
  );
}
