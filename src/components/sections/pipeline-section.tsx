"use client";

import { useState } from "react";
import { Camera, Clapperboard, Handshake, SlidersHorizontal } from "lucide-react";
import { capabilityPillars, gearManifest } from "@/data/pipeline";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  clapperboard: Clapperboard,
  handshake: Handshake,
  "sliders-horizontal": SlidersHorizontal,
  camera: Camera,
};

export function PipelineSection() {
  const [active, setActive] = useState(capabilityPillars[0].id);

  return (
    <section id="pipeline" className="relative border-t border-white/10 py-28 md:py-40">
      <div className="container">
        <Reveal className="mb-16">
          <p className="text-xs uppercase tracking-widest2 text-obsidian-400">The Pipeline</p>
          <h2 className="mt-6 max-w-2xl font-display text-fluid-xl leading-[1.05] text-white">
            Full-service, end to end.
          </h2>
        </Reveal>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col">
            {capabilityPillars.map((pillar, i) => {
              const Icon = icons[pillar.icon];
              const isActive = active === pillar.id;
              return (
                <Reveal key={pillar.id} delay={i * 80}>
                  <button
                    onClick={() => setActive(pillar.id)}
                    data-cursor="hover"
                    className={cn(
                      "group flex w-full items-start gap-6 border-b border-white/10 py-7 text-left transition-colors duration-500",
                      i === 0 && "border-t",
                      isActive ? "border-white/30" : ""
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-sm transition-colors duration-500",
                        isActive ? "text-white" : "text-obsidian-500"
                      )}
                    >
                      {pillar.index}
                    </span>
                    <div className="flex-1">
                      <h3
                        className={cn(
                          "font-display text-2xl transition-colors duration-500 md:text-3xl",
                          isActive
                            ? "text-white"
                            : "text-obsidian-400 group-hover:text-obsidian-200"
                        )}
                      >
                        {pillar.title}
                      </h3>
                      <div
                        className={cn(
                          "overflow-hidden transition-[max-height,opacity,margin-top] duration-500 ease-cinematic",
                          isActive ? "mt-3 max-h-48 opacity-100" : "mt-0 max-h-0 opacity-0"
                        )}
                      >
                        <p className="max-w-md text-obsidian-300">{pillar.description}</p>
                      </div>
                    </div>
                    {Icon && (
                      <Icon
                        className={cn(
                          "mt-1 h-6 w-6 shrink-0 transition-colors duration-500",
                          isActive ? "text-white" : "text-obsidian-600"
                        )}
                      />
                    )}
                  </button>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="rounded-2xl border border-white/10 bg-white/[0.015] p-8 md:p-10">
            <p className="mb-8 font-mono text-xs uppercase tracking-widest2 text-obsidian-400">
              Gear Manifesto — Spec Sheet
            </p>
            <div className="grid gap-8 sm:grid-cols-2">
              {gearManifest.map((group) => (
                <div key={group.category}>
                  <h4 className="mb-3 text-xs uppercase tracking-widest2 text-obsidian-200">
                    {group.category}
                  </h4>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border-b border-white/5 pb-2 font-mono text-sm text-obsidian-400"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
