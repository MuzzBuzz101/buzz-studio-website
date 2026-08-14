"use client";

import { HardDrive, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type StorageInfo = {
  backend: "blob" | "local";
  uploadsEnabled: boolean;
  banner: string | null;
};

export function AdminShell({
  storage,
  refreshing,
  onRefresh,
  onLogout,
  children,
}: {
  storage: StorageInfo | null;
  refreshing?: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-7xl px-5 pb-16 pt-6 md:px-8 md:pt-8">
      <header className="glass sticky top-4 z-40 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-accent/15 px-4 py-3 shadow-[0_20px_60px_-30px_rgba(212,175,55,0.35)] md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-gradient-to-br from-accent/25 to-transparent shadow-[0_0_24px_-6px_rgba(212,175,55,0.7)]">
            <span className="font-display text-sm text-accent">B</span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg tracking-wide text-white md:text-xl">
              BUZZ STUDIO
            </p>
            <p className="text-[10px] uppercase tracking-widest2 text-obsidian-400">
              Studio console
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {storage ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-widest",
                storage.backend === "blob"
                  ? "border-accent/30 bg-accent/10 text-accent-soft"
                  : "border-white/15 bg-white/[0.04] text-obsidian-300"
              )}
              title={storage.banner || undefined}
            >
              <HardDrive className="h-3.5 w-3.5" />
              {storage.backend === "blob" ? "Blob" : "Local"}
            </span>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            className="rounded-full"
            aria-label="Refresh"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="rounded-full"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </header>

      {storage?.banner ? (
        <div className="mt-5 rounded-xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm text-accent-soft">
          {storage.banner}
        </div>
      ) : null}

      {children}
    </div>
  );
}
