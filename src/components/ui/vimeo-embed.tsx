"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VimeoEmbedProps {
  vimeoId: string;
  title: string;
  poster?: string;
  className?: string;
  /** Real aspect ratio of the video. Defaults to "16:9". */
  aspect?: "16:9" | "9:16";
}

/**
 * Facade embed: Vimeo's player bundle is several hundred KB, so the iframe is
 * only injected on interaction. Until then this is just one optimized image.
 */
export function VimeoEmbed({ vimeoId, title, poster, className, aspect = "16:9" }: VimeoEmbedProps) {
  const [active, setActive] = useState(false);
  const isVertical = aspect === "9:16";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black",
        isVertical ? "mx-auto aspect-[9/16] max-w-md" : "aspect-video",
        className
      )}
    >
      {active ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&color=ffffff&autoplay=1`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
        />
      ) : (
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
      )}
    </div>
  );
}
