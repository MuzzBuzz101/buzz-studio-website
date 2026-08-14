"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
import { aboutContent } from "@/data/about";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function AboutSection() {
  const a = aboutContent;

  return (
    <section
      id={a.id}
      className="relative overflow-hidden border-t border-white/10 py-28 md:py-40"
    >
      {/* Ambient gold wash — cinematic, not purple */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(212,175,55,0.09),transparent_50%),radial-gradient(ellipse_at_90%_70%,rgba(255,255,255,0.03),transparent_45%)]"
      />

      <div className="container relative">
        <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          {/* Visual composition: camera dominant + portrait accent */}
          <Reveal className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm md:aspect-[5/6]">
              <Image
                src={a.photos.camera.src}
                alt={a.photos.camera.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover object-[center_20%]"
                priority={false}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-obsidian-950/20"
              />
              <div
                aria-hidden
                className="absolute inset-0 ring-1 ring-inset ring-white/10"
              />
            </div>

            {/* Portrait accent — floating glass frame */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-6 right-4 w-[38%] max-w-[220px] overflow-hidden rounded-sm border border-white/15 bg-obsidian-900/80 shadow-[-20px_30px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur-sm md:-bottom-8 md:right-8 md:w-[34%]"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={a.photos.portrait.src}
                  alt={a.photos.portrait.alt}
                  fill
                  sizes="220px"
                  className="object-cover object-top"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 ring-1 ring-inset ring-accent/25"
                />
              </div>
            </motion.div>

            <p className="mt-12 flex items-center gap-2 text-xs uppercase tracking-widest2 text-obsidian-400 md:mt-14">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              {a.location}
            </p>
          </Reveal>

          {/* Copy */}
          <div className="lg:pb-8">
            <Reveal>
              <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
                {a.eyebrow}
              </p>
              <h2 className="mt-5 font-display text-fluid-xl leading-[1.05] text-white">
                {a.brand}
              </h2>
              <p className="mt-3 font-display text-xl text-accent-soft md:text-2xl">
                {a.name}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-obsidian-100 md:text-xl">
                {a.headline}
              </p>
              <p className="mt-5 max-w-lg text-obsidian-300">{a.lead}</p>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 space-y-4 max-w-lg">
                {a.body.map((para) => (
                  <p key={para.slice(0, 32)} className="text-sm leading-relaxed text-obsidian-400 md:text-base">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <ul className="mt-10 flex flex-wrap gap-2">
                {a.roles.map((role) => (
                  <li
                    key={role}
                    className="border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-widest text-obsidian-300"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <a
                    href={a.cv.primary.href}
                    download={a.cv.primary.filename}
                    data-cursor="hover"
                  >
                    <Download className="h-4 w-4" />
                    {a.cv.primary.label}
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={a.ctas.project.href}>
                    {a.ctas.project.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4">
                <a
                  href={a.cv.secondary.href}
                  download={a.cv.secondary.filename}
                  className="text-xs uppercase tracking-widest2 text-obsidian-500 underline-offset-4 transition-colors hover:text-accent-soft hover:underline"
                >
                  {a.cv.secondary.label}
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
