"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  MessageSquare,
  Send,
  Smartphone,
  X,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

type UiRole = "user" | "assistant";

interface UiMessage {
  id: string;
  role: UiRole;
  content: string;
}

interface AvailabilityState {
  status: "online" | "away";
  label: string;
}

const WELCOME_ONLINE =
  "Studio is online. I can help refine elegant visual direction — or Text / WhatsApp for the fastest personal reply.";

const WELCOME_AWAY =
  "Away for now — I’m the Buzz Studio AI concierge. Share your project mood and deliverables, and I’ll help sharpen the creative direction.";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AiConcierge() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityState>({
    status: "away",
    label: "Away — AI concierge active",
  });
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      try {
        const res = await fetch("/api/availability");
        if (!res.ok) return;
        const data = (await res.json()) as AvailabilityState;
        if (cancelled) return;
        setAvailability({
          status: data.status === "online" ? "online" : "away",
          label:
            data.label ||
            (data.status === "online"
              ? "Studio online"
              : "Away — AI concierge active"),
        });
      } catch {
        // Keep default away state.
      }
    }

    void loadAvailability();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open || seededRef.current) return;
    seededRef.current = true;
    setMessages([
      {
        id: uid(),
        role: "assistant",
        content:
          availability.status === "online" ? WELCOME_ONLINE : WELCOME_AWAY,
      },
    ]);
  }, [open, availability.status]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, pending, open]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || pending) return;

    const userMessage: UiMessage = { id: uid(), role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = (await res.json()) as {
        message?: { content?: string };
        availability?: AvailabilityState;
        error?: string;
      };

      if (data.availability?.status) {
        setAvailability({
          status: data.availability.status === "online" ? "online" : "away",
          label:
            data.availability.label ||
            (data.availability.status === "online"
              ? "Studio online"
              : "Away — AI concierge active"),
        });
      }

      const reply =
        data.message?.content?.trim() ||
        "Something went quiet on my end. Try Text or WhatsApp for a direct line to the studio.";

      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            "I couldn’t reach the concierge just now. Text or WhatsApp will get you through to the studio.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  const online = availability.status === "online";

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-[70] flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex h-[min(32rem,calc(100dvh-7.5rem))] w-[min(22.5rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900/90 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            <header className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3.5">
              <div>
                <p className="font-display text-lg text-white">Studio Concierge</p>
                <p className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-obsidian-300">
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      online ? "bg-accent animate-pulse-glow" : "bg-obsidian-400"
                    )}
                  />
                  {availability.label}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-cursor="hover"
                aria-label="Close concierge"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-obsidian-200 transition-colors hover:border-white/35 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    message.role === "user"
                      ? "ml-auto bg-accent/15 text-accent-soft border border-accent/25"
                      : "mr-auto bg-white/[0.04] text-obsidian-100 border border-white/10"
                  )}
                >
                  {message.content}
                </div>
              ))}
              {pending && (
                <div className="mr-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-obsidian-300">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                  Composing…
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-3 py-2.5">
              <div className="mb-2.5 flex gap-2">
                <a
                  href={siteConfig.sms}
                  data-cursor="hover"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-[11px] uppercase tracking-widest2 text-obsidian-200 transition-colors hover:border-accent/40 hover:text-accent-soft"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  Text
                </a>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-[11px] uppercase tracking-widest2 text-obsidian-200 transition-colors hover:border-accent/40 hover:text-accent-soft"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>

              <form onSubmit={onSubmit} className="flex items-end gap-2">
                <label htmlFor="concierge-input" className="sr-only">
                  Message the studio concierge
                </label>
                <textarea
                  id="concierge-input"
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage(input);
                    }
                  }}
                  placeholder="Describe your project mood…"
                  className="max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-2xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-accent/40"
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  data-cursor="hover"
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-obsidian-50 text-obsidian-950 transition-all hover:bg-white disabled:opacity-40"
                >
                  {pending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-cursor="hover"
        aria-expanded={open}
        aria-label={open ? "Close studio concierge" : "Open studio concierge"}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/35 bg-obsidian-800/90 text-accent shadow-[0_12px_40px_-12px_rgba(212,175,55,0.55)] backdrop-blur-md transition-colors hover:border-accent/60 hover:bg-obsidian-700"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageSquare className="h-5 w-5" />
        )}
      </motion.button>
    </div>
  );
}
