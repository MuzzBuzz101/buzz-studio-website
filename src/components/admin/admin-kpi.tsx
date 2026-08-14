"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, FolderOpen, Images, Inbox, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Kpi = {
  label: string;
  value: number;
  hint?: string;
  icon: React.ReactNode;
  accent?: boolean;
};

function useCountUp(target: number, durationMs = 700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const display = useCountUp(kpi.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.08 + index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border px-5 py-4",
        kpi.accent
          ? "border-accent/35 bg-gradient-to-br from-accent/15 via-white/[0.03] to-transparent"
          : "border-white/10 bg-white/[0.03]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
            {kpi.label}
          </p>
          <p
            className={cn(
              "mt-2 font-display text-3xl tabular-nums md:text-4xl",
              kpi.accent ? "text-accent-soft" : "text-white"
            )}
          >
            {display}
          </p>
          {kpi.hint ? (
            <p className="mt-1 text-xs text-obsidian-400">{kpi.hint}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border",
            kpi.accent
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-white/10 bg-white/[0.04] text-obsidian-300"
          )}
        >
          {kpi.icon}
        </span>
      </div>
    </motion.div>
  );
}

export function AdminKpiStrip({
  newOrders,
  totalOrders,
  folders,
  mediaCount,
}: {
  newOrders: number;
  totalOrders: number;
  folders: number;
  mediaCount: number;
}) {
  const kpis: Kpi[] = [
    {
      label: "New orders",
      value: newOrders,
      hint: newOrders > 0 ? "Needs attention" : "Inbox clear",
      icon:
        newOrders > 0 ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <Mail className="h-4 w-4" />
        ),
      accent: newOrders > 0,
    },
    {
      label: "Total orders",
      value: totalOrders,
      icon: <Inbox className="h-4 w-4" />,
    },
    {
      label: "Folders",
      value: folders,
      icon: <FolderOpen className="h-4 w-4" />,
    },
    {
      label: "Media",
      value: mediaCount,
      icon: <Images className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, i) => (
        <KpiCard key={kpi.label} kpi={kpi} index={i} />
      ))}
    </div>
  );
}
