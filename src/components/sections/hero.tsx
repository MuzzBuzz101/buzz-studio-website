"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { VideoModal } from "@/components/ui/video-modal";
import { siteConfig } from "@/data/site";

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
export function Hero({ videoSrc }: { videoSrc?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

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
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-70"
          />
        ) : (
          <div className="film-grain relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#1c1c1c_0%,#0a0a0a_45%,#000_100%)]">
            <div className="absolute -inset-x-1/2 inset-y-0 animate-sheen bg-[linear-gradient(115deg,transparent_35%,rgba(212,175,55,0.07)_50%,transparent_65%)] will-change-transform motion-reduce:animate-none" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-obsidian-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/60 via-transparent to-obsidian-950/60" />
      </div>

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

        <div className="mt-10 animate-fade-up" style={{ animationDelay: "540ms" }}>
          <VideoModal src={videoSrc} triggerLabel="Play Full Reel" />
        </div>
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
