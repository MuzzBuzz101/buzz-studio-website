"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  Reply,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminOrder, OrderStatus } from "@/lib/admin-types";
import { cn } from "@/lib/utils";
import { formatDate, formatRelativeTime, orderStatusLabel } from "./admin-utils";

type FilterChip = "all" | OrderStatus;

const FILTERS: { id: FilterChip; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "Pending" },
  { id: "read", label: "In progress" },
  { id: "done", label: "Done" },
  { id: "archived", label: "Archived" },
];

export function AdminOrdersPanel({
  orders,
  busy,
  onStatusChange,
  onCopyEmail,
  searchRef,
}: {
  orders: AdminOrder[];
  busy: boolean;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
  onCopyEmail: (email: string) => void;
  searchRef?: React.RefObject<HTMLInputElement>;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterChip>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const drawerOpen = Boolean(selectedId);
  const localSearchRef = useRef<HTMLInputElement>(null);
  const inputRef = searchRef ?? localSearchRef;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      const hay = [o.name, o.email, o.message, o.inquiryType, o.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [orders, query, filter]);

  const selected = useMemo(
    () => orders.find((o) => o.id === selectedId) ?? null,
    [orders, selectedId]
  );

  useEffect(() => {
    if (!selectedId) return;
    if (!orders.some((o) => o.id === selectedId)) {
      setSelectedId(null);
    }
  }, [orders, selectedId]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, message…"
            className="h-11 w-full rounded-full border border-white/12 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-accent/40"
            aria-label="Search orders"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-obsidian-500 sm:inline">
            /
          </kbd>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-widest transition-colors",
                filter === chip.id
                  ? "border-accent/40 bg-accent/15 text-accent-soft"
                  : "border-white/10 text-obsidian-300 hover:border-white/25 hover:text-white"
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-6 text-center">
          <p className="font-display text-2xl text-white">Quiet for now</p>
          <p className="mt-2 max-w-sm text-sm text-obsidian-400">
            {orders.length === 0
              ? "Client inquiries from the contact form will land here."
              : "Nothing matches this search or filter."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <ul className="divide-y divide-white/10">
            {filtered.map((order) => (
              <li key={order.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(order.id)}
                  className={cn(
                    "flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[0.04] md:px-5",
                    selectedId === order.id && "bg-white/[0.05]"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      order.status === "new"
                        ? "bg-accent shadow-[0_0_10px_rgba(212,175,55,0.7)]"
                        : "bg-white/20"
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-white">
                        {order.name}
                      </p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest",
                          order.status === "new" &&
                            "bg-accent/20 text-accent-soft",
                          order.status === "read" &&
                            "bg-white/10 text-obsidian-200",
                          order.status === "done" &&
                            "bg-emerald-500/15 text-emerald-200",
                          order.status === "archived" &&
                            "bg-white/5 text-obsidian-400"
                        )}
                      >
                        {orderStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-obsidian-400">
                      {order.email}
                      {order.inquiryType ? ` · ${order.inquiryType}` : ""}
                    </p>
                    {order.message ? (
                      <p className="mt-1.5 line-clamp-1 text-xs text-obsidian-300">
                        {order.message}
                      </p>
                    ) : null}
                  </div>
                  <time
                    className="shrink-0 font-mono text-[11px] text-obsidian-500"
                    title={formatDate(order.createdAt)}
                  >
                    {formatRelativeTime(order.createdAt)}
                  </time>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AnimatePresence>
        {selected ? (
          <>
            <motion.button
              type="button"
              aria-label="Close order details"
              className="fixed inset-0 z-50 bg-obsidian-950/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedId(null)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-drawer-title"
              className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-lg flex-col border-l border-white/10 bg-obsidian-900/95 shadow-[-30px_0_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 md:px-6">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
                    Inquiry
                  </p>
                  <h2
                    id="order-drawer-title"
                    className="mt-1 truncate font-display text-2xl text-white md:text-3xl"
                  >
                    {selected.name}
                  </h2>
                  <p
                    className="mt-1 text-xs text-obsidian-400"
                    title={formatDate(selected.createdAt)}
                  >
                    {formatRelativeTime(selected.createdAt)} ·{" "}
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-full border border-white/15 p-2 text-obsidian-300 transition-colors hover:border-white/40 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6 md:px-6">
                <div className="flex flex-wrap gap-2">
                  {selected.status === "new" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => void onStatusChange(selected.id, "read")}
                    >
                      <Check className="h-3.5 w-3.5" />
                      In progress
                    </Button>
                  ) : null}
                  {selected.status !== "done" &&
                  selected.status !== "archived" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => void onStatusChange(selected.id, "done")}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Mark done
                    </Button>
                  ) : null}
                  {selected.status !== "archived" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => void onStatusChange(selected.id, "archived")}
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => void onStatusChange(selected.id, "read")}
                    >
                      Restore
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent(
                        `Re: ${selected.inquiryType || "your inquiry"} — Buzz Studio`
                      )}`}
                    >
                      <Reply className="h-3.5 w-3.5" />
                      Reply
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCopyEmail(selected.email)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy email
                  </Button>
                </div>

                <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
                      Email
                    </dt>
                    <dd className="mt-2 text-sm text-white">
                      <a
                        href={`mailto:${selected.email}`}
                        className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5 text-accent" />
                        {selected.email}
                      </a>
                    </dd>
                  </div>
                  {selected.phone ? (
                    <div>
                      <dt className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
                        Phone
                      </dt>
                      <dd className="mt-2 text-sm text-white">{selected.phone}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
                      Project type
                    </dt>
                    <dd className="mt-2 text-sm text-white">
                      {selected.inquiryType || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
                      Video length
                    </dt>
                    <dd className="mt-2 text-sm text-white">
                      {selected.videoLength
                        ? `${selected.videoLength} min`
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
                      Status
                    </dt>
                    <dd className="mt-2">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest",
                          selected.status === "new" &&
                            "bg-accent/20 text-accent-soft",
                          selected.status === "read" &&
                            "bg-white/10 text-obsidian-200",
                          selected.status === "done" &&
                            "bg-emerald-500/15 text-emerald-200",
                          selected.status === "archived" &&
                            "bg-white/5 text-obsidian-400"
                        )}
                      >
                        {orderStatusLabel(selected.status)}
                      </span>
                    </dd>
                  </div>
                </dl>

                {selected.meta &&
                Object.keys(selected.meta).some((k) => k !== "source") ? (
                  <div className="mt-8">
                    <p className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
                      Details
                    </p>
                    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                      {Object.entries(selected.meta)
                        .filter(([key]) => key !== "source")
                        .map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-[10px] uppercase tracking-widest2 text-obsidian-500">
                              {key}
                            </dt>
                            <dd className="mt-1 text-sm text-obsidian-100">
                              {value == null || value === ""
                                ? "—"
                                : String(value)}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                ) : null}

                <div className="mt-8">
                  <p className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
                    Message
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-obsidian-100">
                    {selected.message || "—"}
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
