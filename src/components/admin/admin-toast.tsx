"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  toast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useAdminToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useAdminToast must be used within AdminToastProvider");
  }
  return ctx;
}

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[min(100vw-2rem,22rem)] flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <ToastCard key={item.id} item={item} onDone={() => dismiss(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  item,
  onDone,
}: {
  item: ToastItem;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 2800);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl",
        item.tone === "success"
          ? "border-accent/25 bg-obsidian-800/90 text-accent-soft"
          : "border-red-400/30 bg-obsidian-800/90 text-red-200"
      )}
      role="status"
    >
      {item.tone === "success" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      ) : (
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
      )}
      <p className="text-sm leading-snug">{item.message}</p>
    </motion.div>
  );
}
