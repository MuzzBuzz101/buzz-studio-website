"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,175,55,0.12),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(255,255,255,0.04),transparent_45%)]"
      />
      <div aria-hidden className="film-grain pointer-events-none absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/35 bg-accent/10"
          >
            <Lock className="h-5 w-5 text-accent" />
          </motion.div>
          <p className="mt-6 font-display text-3xl tracking-[0.2em] text-white md:text-4xl">
            BUZZ STUDIO
          </p>
          <p className="mt-3 text-sm text-obsidian-300">
            Enter the studio password to open the desk.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass space-y-5 rounded-2xl p-6 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)] md:p-8"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[11px] uppercase tracking-widest2 text-obsidian-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-lg border border-white/15 bg-black/40 px-4 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-accent/50"
              placeholder="••••••••••••"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Enter studio"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
