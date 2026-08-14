"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  Film,
  Inbox,
  MailWarning,
  Users,
} from "lucide-react";
import type { AdminOrder } from "@/lib/admin-types";
import type { AnalyticsSummary } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import {
  formatCompact,
  formatRelativeTime,
  orderStatusLabel,
} from "./admin-utils";

function useCountUp(target: number, durationMs = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);
  return value;
}

function SparkBars({
  values,
  accent,
}: {
  values: number[];
  accent?: boolean;
}) {
  const max = Math.max(1, ...values);
  return (
    <div className="mt-4 flex h-10 items-end gap-[3px]">
      {values.map((v, i) => (
        <span
          key={i}
          className={cn(
            "min-w-[3px] flex-1 rounded-sm transition-all",
            accent ? "bg-accent/70" : "bg-white/20"
          )}
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
          title={String(v)}
        />
      ))}
    </div>
  );
}

function KpiTile({
  label,
  value,
  hint,
  icon,
  accent,
  spark,
  index,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: React.ReactNode;
  accent?: boolean;
  spark?: number[];
  index: number;
}) {
  const display = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.05 + index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5",
        accent
          ? "border-accent/40 bg-gradient-to-br from-accent/20 via-white/[0.04] to-transparent shadow-[0_0_40px_-18px_rgba(212,175,55,0.55)]"
          : "border-white/10 bg-white/[0.035] backdrop-blur-sm"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/10 blur-2xl"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
            {label}
          </p>
          <p
            className={cn(
              "mt-2 font-display text-3xl tabular-nums md:text-4xl",
              accent ? "text-accent-soft" : "text-white"
            )}
          >
            {formatCompact(display)}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-obsidian-400">{hint}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border",
            accent
              ? "border-accent/45 bg-accent/15 text-accent"
              : "border-white/12 bg-white/[0.05] text-obsidian-300"
          )}
        >
          {icon}
        </span>
      </div>
      {spark && spark.length > 0 ? (
        <SparkBars values={spark} accent={accent} />
      ) : null}
    </motion.div>
  );
}

function ChartPanel({
  title,
  subtitle,
  series,
}: {
  title: string;
  subtitle: string;
  series: { label: string; visitors: number; pageViews: number; videoViews: number }[];
}) {
  const max = Math.max(
    1,
    ...series.flatMap((s) => [s.visitors, s.pageViews, s.videoViews])
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
            {title}
          </p>
          <p className="mt-1 text-sm text-obsidian-300">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-widest text-obsidian-400">
          <span className="inline-flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-accent" /> Visitors
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-white/50" /> Pages
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-accent-soft/70" /> Video
          </span>
        </div>
      </div>

      <div className="mt-6 flex h-40 items-end gap-1.5 md:gap-2">
        {series.map((day) => (
          <div
            key={day.label}
            className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-0.5"
            title={`${day.label}: ${day.visitors} visitors, ${day.pageViews} pages, ${day.videoViews} video`}
          >
            <div className="flex w-full flex-1 items-end justify-center gap-0.5">
              <span
                className="w-[28%] rounded-t-sm bg-accent/80"
                style={{
                  height: `${Math.max(2, (day.visitors / max) * 100)}%`,
                }}
              />
              <span
                className="w-[28%] rounded-t-sm bg-white/35"
                style={{
                  height: `${Math.max(2, (day.pageViews / max) * 100)}%`,
                }}
              />
              <span
                className="w-[28%] rounded-t-sm bg-accent-soft/55"
                style={{
                  height: `${Math.max(2, (day.videoViews / max) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-obsidian-500">
        <span>{series[0]?.label}</span>
        <span>{series[series.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export function AdminDashboardPanel({
  analytics,
  orders,
  onOpenOrders,
}: {
  analytics: AnalyticsSummary | null;
  orders: AdminOrder[];
  onOpenOrders?: () => void;
}) {
  const last7 = useMemo(() => {
    const daily = analytics?.daily || [];
    return daily.slice(-7).map((d) => ({
      label: d.date.slice(5),
      visitors: d.visitors,
      pageViews: d.pageViews,
      videoViews: d.videoViews,
    }));
  }, [analytics]);

  const last30Spark = useMemo(() => {
    const daily = analytics?.daily || [];
    return {
      visitors: daily.map((d) => d.visitors),
      pages: daily.map((d) => d.pageViews),
      video: daily.map((d) => d.videoViews),
    };
  }, [analytics]);

  const recent = orders.slice(0, 6);
  const topVideos = analytics?.videoViews.slice(0, 6) || [];

  const pending = analytics?.orders.pending ?? 0;
  const done = analytics?.orders.done ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-widest2 text-accent">
          Live desk
        </p>
        <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
          Studio console
        </h2>
        <p className="mt-2 max-w-xl text-sm text-obsidian-400">
          Visitors, film plays, and client orders — one cinematic overview.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiTile
          index={0}
          label="Visitors"
          value={analytics?.visitors ?? 0}
          hint="Unique-ish (bs_vid)"
          icon={<Users className="h-4 w-4" />}
          spark={last30Spark.visitors}
          accent
        />
        <KpiTile
          index={1}
          label="Page views"
          value={analytics?.pageViews ?? 0}
          icon={<Eye className="h-4 w-4" />}
          spark={last30Spark.pages}
        />
        <KpiTile
          index={2}
          label="Video views"
          value={analytics?.videoViewsTotal ?? 0}
          icon={<Film className="h-4 w-4" />}
          spark={last30Spark.video}
        />
        <KpiTile
          index={3}
          label="Pending"
          value={pending}
          hint={pending > 0 ? "Needs attention" : "Inbox clear"}
          icon={<MailWarning className="h-4 w-4" />}
          accent={pending > 0}
        />
        <KpiTile
          index={4}
          label="Done"
          value={done}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <ChartPanel
          title="Last 7 days"
          subtitle="Visitors · page views · video plays"
          series={last7}
        />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
                Order pulse
              </p>
              <p className="mt-1 font-display text-2xl text-white">
                {analytics?.orders.total ?? orders.length}
              </p>
            </div>
            {onOpenOrders ? (
              <button
                type="button"
                onClick={onOpenOrders}
                className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-widest text-obsidian-300 transition-colors hover:border-accent/40 hover:text-accent-soft"
              >
                Open orders
              </button>
            ) : null}
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            {[
              {
                label: "Pending",
                value: analytics?.orders.pending ?? 0,
                tone: "accent" as const,
              },
              {
                label: "In progress",
                value: analytics?.orders.inProgress ?? 0,
                tone: "muted" as const,
              },
              {
                label: "Done",
                value: analytics?.orders.done ?? 0,
                tone: "muted" as const,
              },
              {
                label: "Archived",
                value: analytics?.orders.archived ?? 0,
                tone: "dim" as const,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-white/10 bg-obsidian-950/40 px-3 py-3"
              >
                <dt className="text-[10px] uppercase tracking-widest text-obsidian-500">
                  {row.label}
                </dt>
                <dd
                  className={cn(
                    "mt-1 font-display text-2xl tabular-nums",
                    row.tone === "accent" && "text-accent-soft",
                    row.tone === "muted" && "text-white",
                    row.tone === "dim" && "text-obsidian-300"
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-accent" />
            <p className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
              Recent orders
            </p>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-obsidian-500">
              No inquiries yet — contact form orders land here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-white/10">
              {recent.map((o) => (
                <li
                  key={o.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{o.name}</p>
                    <p className="mt-0.5 truncate text-xs text-obsidian-400">
                      {o.inquiryType || o.email}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest",
                        o.status === "new" && "bg-accent/20 text-accent-soft",
                        o.status === "read" && "bg-white/10 text-obsidian-200",
                        o.status === "done" && "bg-emerald-500/15 text-emerald-200",
                        o.status === "archived" && "bg-white/5 text-obsidian-500"
                      )}
                    >
                      {orderStatusLabel(o.status)}
                    </span>
                    <p className="mt-1 font-mono text-[10px] text-obsidian-500">
                      {formatRelativeTime(o.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-accent" />
            <p className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
              Top videos
            </p>
          </div>
          {topVideos.length === 0 ? (
            <p className="mt-6 text-sm text-obsidian-500">
              Video plays from case studies and the hero reel will rank here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {topVideos.map((v, i) => {
                const max = topVideos[0]?.views || 1;
                return (
                  <li key={v.id}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-obsidian-200">
                        <span className="mr-2 font-mono text-[10px] text-obsidian-500">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {v.id}
                      </span>
                      <span className="shrink-0 tabular-nums text-accent-soft">
                        {formatCompact(v.views)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent/80 to-accent-soft/60"
                        style={{ width: `${(v.views / max) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
