"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import {
  deliverySteps,
  proposalChapters,
  proposalInclusions,
  proposalPdfHref,
  proposalPreviews,
} from "@/data/proposal";
import { cn } from "@/lib/utils";

export function ProposalProcess() {
  const [activePreview, setActivePreview] = useState(0);

  return (
    <section
      id="proposal"
      className="relative overflow-hidden border-t border-white/10 py-28 md:py-40"
    >
      {/* Soft cinematic atmosphere — not the visual idea, just depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(212,175,55,0.07),transparent_45%),radial-gradient(ellipse_at_90%_60%,rgba(255,255,255,0.03),transparent_40%)]"
      />

      <div className="container relative">
        <div className="mb-16 flex flex-col gap-10 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
              Client Presentations
            </p>
            <h2 className="mt-6 font-display text-fluid-xl leading-[1.05] text-white">
              Designed proposals.
              <br />
              <span className="text-gradient-silver italic">Unmistakable delivery.</span>
            </h2>
            <p className="mt-8 max-w-lg text-obsidian-300">
              Every engagement arrives as a crafted presentation — problem, cinematic solution,
              week-by-week roadmap, and clear deliverables — so clients see the full path before
              a single frame is shot.
            </p>
          </Reveal>

          <Reveal delay={100} className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href={proposalPdfHref} target="_blank" rel="noreferrer">
                <FileText className="h-4 w-4" />
                View sample proposal
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#contact">
                Book a presentation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>

        {/* Visual anchor: live page previews from the sample deck */}
        <Reveal delay={80} className="mb-20 md:mb-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <a
              href={proposalPdfHref}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              className="group relative mx-auto block w-full max-w-xl lg:max-w-none"
              aria-label="Open sample Buzz Studio proposal PDF"
            >
              <div className="relative aspect-[16/10] w-full">
                {proposalPreviews.map((preview, i) => {
                  const offset = i - activePreview;
                  const isActive = i === activePreview;
                  return (
                    <div
                      key={preview.id}
                      className={cn(
                        "absolute inset-[6%] overflow-hidden rounded-xl border border-white/10 bg-obsidian-800 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] transition-all duration-700 ease-cinematic",
                        isActive
                          ? "z-20 translate-y-0 scale-100 opacity-100"
                          : "z-10 opacity-70"
                      )}
                      style={{
                        transform: isActive
                          ? "translateY(0) rotate(0deg) scale(1)"
                          : `translateY(${offset * 10}px) translateX(${offset * 18}px) rotate(${offset * 2.5}deg) scale(0.96)`,
                      }}
                    >
                      <Image
                        src={preview.src}
                        alt={preview.alt}
                        width={1100}
                        height={619}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-cinematic group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 90vw, 55vw"
                        priority={i === 0}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5" />
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest2 text-obsidian-400 transition-colors group-hover:text-accent-soft">
                Sample deck · open PDF
                <ArrowUpRight className="h-3.5 w-3.5" />
              </p>
            </a>

            <div>
              <p className="mb-6 font-mono text-xs uppercase tracking-widest2 text-obsidian-400">
                Inside the deck
              </p>
              <div className="border-t border-white/10">
                {proposalPreviews.map((preview, i) => (
                  <button
                    key={preview.id}
                    type="button"
                    onClick={() => setActivePreview(i)}
                    onMouseEnter={() => setActivePreview(i)}
                    data-cursor="hover"
                    className={cn(
                      "flex w-full items-center justify-between border-b border-white/10 py-5 text-left transition-colors duration-500",
                      activePreview === i ? "text-white" : "text-obsidian-400 hover:text-obsidian-200"
                    )}
                  >
                    <span className="flex items-baseline gap-5">
                      <span
                        className={cn(
                          "font-mono text-sm",
                          activePreview === i ? "text-accent" : "text-obsidian-500"
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span className="font-display text-2xl md:text-3xl">{preview.label}</span>
                    </span>
                    <span
                      className={cn(
                        "h-px w-10 transition-all duration-500",
                        activePreview === i ? "bg-accent w-16" : "bg-white/15"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* How presentations are designed */}
        <Reveal className="mb-20 md:mb-28">
          <p className="text-xs uppercase tracking-widest2 text-obsidian-400">How it&rsquo;s designed</p>
          <h3 className="mt-4 max-w-xl font-display text-fluid-lg leading-[1.1] text-white">
            Four chapters. Zero ambiguity.
          </h3>
          <ol className="mt-12 grid gap-0 border-t border-white/10 md:grid-cols-4">
            {proposalChapters.map((chapter, i) => (
              <li
                key={chapter.index}
                className={cn(
                  "border-b border-white/10 py-8 md:border-b-0 md:px-6 md:py-10",
                  i < proposalChapters.length - 1 && "md:border-r",
                  i === 0 && "md:pl-0",
                  i === proposalChapters.length - 1 && "md:pr-0"
                )}
              >
                <Reveal delay={i * 90}>
                  <span className="font-mono text-xs text-accent">{chapter.index}</span>
                  <h4 className="mt-4 font-display text-xl text-white md:text-2xl">{chapter.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-obsidian-300">{chapter.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Week-by-week delivery cadence */}
        <div className="mb-20 md:mb-28">
          <Reveal>
            <p className="text-xs uppercase tracking-widest2 text-obsidian-400">The process</p>
            <h3 className="mt-4 max-w-xl font-display text-fluid-lg leading-[1.1] text-white">
              Three weeks. Shoot to ship.
            </h3>
          </Reveal>

          <div className="relative mt-14">
            <div
              aria-hidden
              className="absolute left-4 top-2 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-accent/60 via-white/20 to-accent/40 md:left-[16.6%] md:block md:w-[66.6%]"
            />
            <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
              {deliverySteps.map((step, i) => (
                <Reveal key={step.index} delay={i * 120}>
                  <li className="relative pl-10 md:pl-0 md:pt-8">
                    <span
                      aria-hidden
                      className="absolute left-0 top-1.5 flex h-3 w-3 items-center justify-center md:left-0 md:top-0"
                    >
                      <span className="absolute h-3 w-3 rounded-full bg-accent/30 animate-pulse-glow" />
                      <span className="relative h-2 w-2 rounded-full bg-accent" />
                    </span>
                    <p className="font-mono text-xs uppercase tracking-widest2 text-obsidian-400">
                      {step.phase}
                    </p>
                    <h4 className="mt-3 font-display text-2xl text-white md:text-3xl">{step.title}</h4>
                    <p className="mt-3 max-w-sm text-obsidian-300">{step.description}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        {/* What clients receive */}
        <Reveal>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
                  What you receive
                </p>
                <h3 className="mt-4 font-display text-fluid-lg leading-[1.1] text-white">
                  Premium craft, itemized.
                </h3>
              </div>
              <a
                href={proposalPdfHref}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-2 text-sm text-obsidian-200 transition-colors hover:text-accent-soft"
              >
                Download sample presentation
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {proposalInclusions.map((item, i) => (
                <li key={item.title} className="border-t border-white/10 pt-5">
                  <Reveal delay={i * 70}>
                    <h4 className="font-display text-lg text-white">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-obsidian-300">{item.description}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
