"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

export function SelectedWorks({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="container">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
              Selected Works
            </p>
            <h2 className="mt-6 max-w-2xl font-display text-fluid-xl leading-[1.05] text-white">
              Commercial craft, narrative intent.
            </h2>
          </Reveal>

          <div className="flex items-center gap-1 rounded-full border border-white/10 p-1">
            <button
              onClick={() => setView("grid")}
              data-cursor="hover"
              aria-label="Grid view"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                view === "grid" ? "bg-white text-obsidian-950" : "text-obsidian-400 hover:text-white"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              data-cursor="hover"
              aria-label="List view"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                view === "list" ? "bg-white text-obsidian-950" : "text-obsidian-400 hover:text-white"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} view="grid" />
            ))}
          </div>
        ) : (
          <div className="border-t border-white/10">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} view="list" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
