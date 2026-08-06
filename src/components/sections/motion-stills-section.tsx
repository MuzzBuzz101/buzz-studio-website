"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotatingCover } from "@/components/ui/rotating-cover";
import { Project, StillCategory } from "@/types";
import { stills as allStills } from "@/data/stills";
import { cn, getProjectCoverImages } from "@/lib/utils";
import Link from "next/link";
import { Play } from "lucide-react";

// Only mounted once a photo is opened, so it stays out of the initial bundle.
const Lightbox = dynamic(() => import("@/components/ui/lightbox").then((m) => m.Lightbox), {
  ssr: false,
});

const motionCategories = [
  "All",
  "Food & Beverage",
  "Music Video",
  "Real Estate",
  "Fashion",
  "Events & Portraits",
  "Cinematic",
] as const;
const stillCategories: Array<StillCategory | "All"> = [
  "All",
  "Food & Product",
  "Fashion & Portraits",
  "Events & Graduation",
];

function MotionGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof motionCategories)[number]>("All");

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter]
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        {motionCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            data-cursor="hover"
            className={cn(
              "rounded-full border px-4 py-2 text-xs uppercase tracking-widest2 transition-colors",
              filter === cat
                ? "border-white bg-white text-obsidian-950"
                : "border-white/15 text-obsidian-400 hover:border-white/40 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            data-cursor="view"
            className="group relative block aspect-video overflow-hidden rounded-xl bg-obsidian-800"
          >
            <RotatingCover
              images={getProjectCoverImages(project)}
              alt={project.title}
              sizes="(max-width: 768px) 100vw, 33vw"
              startIndex={1}
              className="object-cover transition-transform duration-1000 ease-cinematic group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-obsidian-950">
                <Play className="h-5 w-5 pl-0.5" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-xs uppercase tracking-widest2 text-obsidian-300">{project.category}</p>
              <h4 className="mt-1 font-display text-lg text-white">{project.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StillsMasonry() {
  const [filter, setFilter] = useState<(typeof stillCategories)[number]>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hasOpened, setHasOpened] = useState(false);

  const openPhoto = (index: number) => {
    setHasOpened(true);
    setActiveIndex(index);
  };

  const filtered = useMemo(
    () => (filter === "All" ? allStills : allStills.filter((s) => s.category === filter)),
    [filter]
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        {stillCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            data-cursor="hover"
            className={cn(
              "rounded-full border px-4 py-2 text-xs uppercase tracking-widest2 transition-colors",
              filter === cat
                ? "border-white bg-white text-obsidian-950"
                : "border-white/15 text-obsidian-400 hover:border-white/40 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((photo, i) => (
          <Reveal
            key={photo.id}
            delay={(i % 6) * 60}
            className="mb-4 break-inside-avoid"
          >
            <button
              onClick={() => openPhoto(i)}
              data-cursor="view"
              className="group relative block w-full overflow-hidden rounded-lg"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="text-left text-xs uppercase tracking-widest2 text-white/90">
                  {photo.category}
                </p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Mounted on first open and kept mounted so the close animation can play. */}
      {hasOpened && (
        <Lightbox photos={filtered} index={activeIndex} onIndexChange={setActiveIndex} />
      )}
    </div>
  );
}

export function MotionStillsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="motion-stills" className="relative border-t border-white/10 py-28 md:py-40">
      <div className="container">
        <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
              Motion vs. Stills
            </p>
            <h2 className="mt-6 max-w-2xl font-display text-fluid-xl leading-[1.05] text-white">
              Two disciplines. One eye.
            </h2>
          </div>
        </Reveal>

        <Tabs defaultValue="motion">
          <TabsList>
            <TabsTrigger value="motion">Motion</TabsTrigger>
            <TabsTrigger value="stills">Stills</TabsTrigger>
          </TabsList>
          <TabsContent value="motion">
            <MotionGrid projects={projects} />
          </TabsContent>
          <TabsContent value="stills">
            <StillsMasonry />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
