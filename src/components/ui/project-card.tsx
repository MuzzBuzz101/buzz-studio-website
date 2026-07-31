"use client";

import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
  view?: "grid" | "list";
}

export function ProjectCard({ project, index, view = "grid" }: ProjectCardProps) {
  if (view === "list") {
    return (
      <Link
        href={`/work/${project.slug}`}
        data-cursor="view"
        className="group relative flex flex-col gap-4 border-b border-white/10 py-8 transition-colors duration-500 hover:border-white/30 md:flex-row md:items-center md:justify-between md:py-10"
      >
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-xs text-obsidian-400">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-2xl text-obsidian-100 transition-colors duration-500 group-hover:text-white md:text-3xl">
            {project.title}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pl-10 text-sm text-obsidian-400 md:pl-0">
          <span>{project.client}</span>
          <span className="hidden md:inline">{project.roles.join(" / ")}</span>
          <span>{project.year}</span>
        </div>
        <div className="pointer-events-none absolute right-0 top-1/2 hidden w-40 -translate-y-1/2 overflow-hidden rounded-lg opacity-0 shadow-2xl transition-all duration-500 group-hover:opacity-100 md:block"
          style={{ transform: "translateY(-50%) translateX(20%)" }}
        >
          <Image
            src={project.coverImage}
            alt=""
            width={240}
            height={150}
            className="aspect-video w-full object-cover"
          />
        </div>
      </Link>
    );
  }

  return (
    <Reveal delay={(index % 3) * 100}>
      <Link
        href={`/work/${project.slug}`}
        data-cursor="view"
        className={cn("group relative block overflow-hidden rounded-xl bg-obsidian-800")}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-1200 ease-cinematic group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className="rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-widest2 text-white/80 backdrop-blur-sm">
              {project.category}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-6 transition-transform duration-500 group-hover:translate-y-0">
            <p className="text-xs uppercase tracking-widest2 text-obsidian-300">
              {project.client} — {project.year}
            </p>
            <h3 className="mt-2 font-display text-2xl text-white md:text-[1.7rem]">
              {project.title}
            </h3>
            <p className="mt-2 max-h-0 overflow-hidden text-sm text-obsidian-300 opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-10 group-hover:opacity-100">
              {project.roles.join(" / ")}
            </p>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
