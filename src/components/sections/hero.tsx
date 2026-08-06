"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, Volume2, VolumeX } from "lucide-react";
import { VideoModal } from "@/components/ui/video-modal";
import { siteConfig } from "@/data/site";

const ROTATE_MS = 15000;

/**
 * Plays one background video clip at a time: a hard cut to the next clip
 * every `ROTATE_MS`, or sooner if the current clip ends first. Only ever a
 * single <video> element in the DOM — no cross-fade, no two clips ever
 * rendered/playing at once — so there's no overlap between clips. Only the
 * currently-playing clip is ever downloaded.
 *
 * Starts muted (required for autoplay). Mute state is owned by the parent so
 * the Netflix-style toggle can sit outside the parallax background layer.
 */
function HeroVideoRotator({ clips, muted }: { clips: string[]; muted: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
    const el = videoRef.current;
    if (!el) return;
    el.muted = muted;
    if (!muted) {
      el.volume = 1;
      el.play().catch(() => {});
    }
  }, [muted]);

  const advance = useCallback(() => {
    if (clips.length < 2) return;
    indexRef.current = (indexRef.current + 1) % clips.length;
    setIndex(indexRef.current);
  }, [clips]);

  // Hard-cut timer: switches clips every ROTATE_MS regardless of clip length,
  // so a long clip still only gets its allotted slice of screen time.
  useEffect(() => {
    if (clips.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(advance, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [clips, advance]);

  // Whenever the source changes (timer or a short clip ending early), load
  // and play it from the top. Belt-and-suspenders: some browsers/automation
  // contexts don't honor the `autoPlay` attribute reliably.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = mutedRef.current;
    el.load();
    el.play().catch(() => {});
  }, [index]);

  return (
    <video
      ref={videoRef}
      src={clips[index]}
      autoPlay
      muted={muted}
      loop={clips.length < 2}
      playsInline
      onEnded={advance}
      className="absolute inset-0 h-full w-full object-cover opacity-70"
    />
  );
}

const HEADLINE = siteConfig.heroSubtitle;
const TITLE = siteConfig.heroTitle;

/**
 * Splits the title into per-character spans (for the staggered fade-up) while
 * keeping each word as its own flex item, so the browser only ever wraps
 * between words instead of mid-word.
 */
function renderStaggeredTitle(title: string) {
  const words = title.split(" ");
  let charIndex = 0;
  const nodes: React.ReactNode[] = [];

  words.forEach((word, wi) => {
    nodes.push(
      <span key={`w-${wi}`} className="inline-flex whitespace-nowrap">
        {word.split("").map((char) => {
          const i = charIndex++;
          return (
            <span
              key={`c-${i}`}
              className="inline-block animate-fade-up will-change-transform"
              style={{ animationDelay: `${140 + i * 25}ms` }}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
    if (wi < words.length - 1) nodes.push(" ");
  });

  return nodes;
}

/**
 * The reveal is intentionally CSS-driven rather than Framer Motion: the hero is
 * above the fold, so it must paint on first render instead of waiting for the
 * JS bundle to download and hydrate.
 */
export function Hero({
  videoSrc,
  videos,
  images,
}: {
  videoSrc?: string;
  videos?: string[];
  images?: string[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [muted, setMuted] = useState(true);
  const hasVideoBg = Boolean(videoSrc || videos?.length);

  // Background photo rotation — only runs when there's no video background and
  // more than one image was supplied. Skips entirely for reduced-motion users.
  useEffect(() => {
    if (videoSrc || videos?.length || !images || images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActiveImage((i) => (i + 1) % images.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [videoSrc, videos, images]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current || !bgRef.current) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    // GSAP + ScrollTrigger (~70KB) is only needed once the user scrolls, so it
    // loads as a separate chunk rather than blocking first paint.
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to(bgRef.current, {
          scale: 1.18,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, sectionRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] w-full items-end overflow-hidden bg-obsidian-950"
    >
      <div ref={bgRef} className="absolute inset-0">
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted={muted}
            loop
            playsInline
            className="h-full w-full object-cover opacity-70"
          />
        ) : videos && videos.length > 0 ? (
          <div className="relative h-full w-full">
            <HeroVideoRotator clips={videos} muted={muted} />
          </div>
        ) : images && images.length > 0 ? (
          <div className="relative h-full w-full">
            {images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover opacity-70 transition-opacity duration-1500 ease-cinematic ${
                  i === activeImage ? "opacity-70" : "opacity-0"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="film-grain relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#1c1c1c_0%,#0a0a0a_45%,#000_100%)]">
            <div className="absolute -inset-x-1/2 inset-y-0 animate-sheen bg-[linear-gradient(115deg,transparent_35%,rgba(212,175,55,0.07)_50%,transparent_65%)] will-change-transform motion-reduce:animate-none" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-obsidian-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/60 via-transparent to-obsidian-950/60" />
      </div>

      {hasVideoBg && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          data-cursor="hover"
          className="absolute bottom-8 left-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/55 hover:bg-black/75 md:bottom-10 md:left-10"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}

      <div className="container relative z-10 pb-20 pt-40 md:pb-28">
        <p
          className="mb-6 animate-fade-up text-xs uppercase tracking-widest2 text-obsidian-300"
          style={{ animationDelay: "80ms" }}
        >
          {siteConfig.location}
        </p>

        <h1 className="flex max-w-5xl flex-wrap font-display text-fluid-hero font-medium leading-[0.95] text-white">
          {renderStaggeredTitle(TITLE)}
        </h1>

        <p
          className="mt-6 max-w-xl animate-fade-up text-lg text-obsidian-300 md:text-xl"
          style={{ animationDelay: "420ms" }}
        >
          {HEADLINE}
        </p>

        {videoSrc && (
          <div className="mt-10 animate-fade-up" style={{ animationDelay: "540ms" }}>
            <VideoModal src={videoSrc} triggerLabel="Play Full Reel" />
          </div>
        )}
      </div>

      <div
        className="absolute bottom-8 right-8 hidden animate-fade-in flex-col items-center gap-3 text-obsidian-400 md:flex"
        style={{ animationDelay: "700ms" }}
      >
        <span className="text-[10px] uppercase tracking-widest2 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <ArrowDown className="h-4 w-4 animate-bob motion-reduce:animate-none" />
      </div>
    </section>
  );
}
