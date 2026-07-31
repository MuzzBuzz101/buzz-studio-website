"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { StillPhoto } from "@/types";

interface LightboxProps {
  photos: StillPhoto[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

export function Lightbox({ photos, index, onIndexChange }: LightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const open = index !== null;
  const photo = index !== null ? photos[index] : null;

  useEffect(() => {
    setZoomed(false);
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIndexChange(null);
      if (e.key === "ArrowRight") onIndexChange(index !== null ? (index + 1) % photos.length : null);
      if (e.key === "ArrowLeft")
        onIndexChange(index !== null ? (index - 1 + photos.length) % photos.length : null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, photos.length, onIndexChange]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && onIndexChange(null)}>
      <AnimatePresence>
        {open && photo && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[90] bg-obsidian-950/97 backdrop-blur-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[95] flex flex-col items-center justify-center p-4 md:p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <DialogPrimitive.Title className="sr-only">{photo.alt}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">
                  {photo.category} photograph
                </DialogPrimitive.Description>

                <div className="relative flex h-full w-full max-w-6xl flex-1 items-center justify-center overflow-hidden">
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      onClick={() => setZoomed((z) => !z)}
                      data-cursor={zoomed ? "hover" : "hover"}
                      data-cursor-text={zoomed ? "Zoom Out" : "Zoom In"}
                      className={`cursor-none-desktop object-contain transition-transform duration-700 ease-cinematic ${
                        zoomed ? "scale-150" : "scale-100"
                      }`}
                      sizes="90vw"
                      priority
                    />
                  </motion.div>

                  <button
                    onClick={() => onIndexChange((index! - 1 + photos.length) % photos.length)}
                    data-cursor="hover"
                    aria-label="Previous photo"
                    className="absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition hover:text-white md:left-4"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={() => onIndexChange((index! + 1) % photos.length)}
                    data-cursor="hover"
                    aria-label="Next photo"
                    className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition hover:text-white md:right-4"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </div>

                <div className="mt-4 flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs uppercase tracking-widest2 text-obsidian-300">
                  <div className="flex flex-wrap gap-x-6 gap-y-1">
                    {photo.camera && <span>{photo.camera}</span>}
                    {photo.lens && <span>{photo.lens}</span>}
                    {photo.lighting && <span>{photo.lighting}</span>}
                    {photo.location && <span>{photo.location}</span>}
                  </div>
                  <span className="text-obsidian-500">
                    {(index ?? 0) + 1} / {photos.length}
                  </span>
                </div>

                <button
                  onClick={() => setZoomed((z) => !z)}
                  data-cursor="hover"
                  aria-label="Toggle zoom"
                  className="absolute right-16 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white md:right-20 md:top-6"
                >
                  {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                </button>
                <DialogPrimitive.Close
                  data-cursor="close"
                  aria-label="Close"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white md:right-6 md:top-6"
                >
                  <X className="h-4 w-4" />
                </DialogPrimitive.Close>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
