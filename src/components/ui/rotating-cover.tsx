"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RotatingCoverProps {
  images: string[];
  alt: string;
  sizes?: string;
  className?: string;
  /** Which image to show first — lets different sections open on a different frame for the same project. */
  startIndex?: number;
  /** Milliseconds between swaps. Defaults to 5s. */
  intervalMs?: number;
}

const DEFAULT_INTERVAL_MS = 5000;

/**
 * Cycles through a project's available photos, crossfading to the next one
 * every `intervalMs`. Renders nothing if no images are available, so callers
 * can keep their existing dark-placeholder fallback.
 */
export function RotatingCover({
  images,
  alt,
  sizes,
  className,
  startIndex = 0,
  intervalMs = DEFAULT_INTERVAL_MS,
}: RotatingCoverProps) {
  const initial = images.length ? startIndex % images.length : 0;
  const [index, setIndex] = useState(initial);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn(
            className,
            "absolute inset-0 transition-opacity duration-1000 ease-cinematic",
            i === index ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
    </>
  );
}
