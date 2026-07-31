"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorVariant = "default" | "hover" | "view" | "drag" | "close";

const VARIANT_LABEL: Record<CursorVariant, string> = {
  default: "",
  hover: "",
  view: "View",
  drag: "Drag",
  close: "Close",
};

/** The circle renders at a fixed 88px and is scaled down, so only transforms animate. */
const BASE_SIZE = 88;
const SCALE = {
  dot: 10 / BASE_SIZE,
  ring: 44 / BASE_SIZE,
  labelled: 1,
};

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  const x = useSpring(useMotionValue(-100), { damping: 28, stiffness: 320, mass: 0.4 });
  const y = useSpring(useMotionValue(-100), { damping: 28, stiffness: 320, mass: 0.4 });
  const scale = useSpring(SCALE.dot, { damping: 24, stiffness: 320, mass: 0.5 });
  const opacity = useMotionValue(0);
  const labelOpacity = useSpring(0, { damping: 30, stiffness: 400 });

  // Refs keep the hot path (mousemove) free of React state updates entirely.
  const pendingTarget = useRef<EventTarget | null>(null);
  const frame = useRef<number | null>(null);
  const currentVariant = useRef<CursorVariant>("default");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const resolveTarget = () => {
      frame.current = null;
      const target = pendingTarget.current;
      if (!(target instanceof Element)) return;

      const el = target.closest<HTMLElement>("[data-cursor]");
      const variant = el ? ((el.dataset.cursor as CursorVariant) || "hover") : "default";
      if (variant === currentVariant.current) return;
      currentVariant.current = variant;

      const nextLabel = el ? el.dataset.cursorText || VARIANT_LABEL[variant] || "" : "";
      scale.set(nextLabel ? SCALE.labelled : variant === "default" ? SCALE.dot : SCALE.ring);
      labelOpacity.set(nextLabel ? 1 : 0);
      setLabel(nextLabel);
    };

    const handleMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      opacity.set(1);

      // Hit-testing is throttled to one DOM traversal per animation frame.
      pendingTarget.current = event.target;
      if (frame.current === null) {
        frame.current = requestAnimationFrame(resolveTarget);
      }
    };

    const handleLeave = () => opacity.set(0);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [x, y, scale, opacity, labelOpacity]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x, y, opacity, willChange: "transform" }}
    >
      <motion.div
        className="absolute rounded-full bg-white"
        style={{
          width: BASE_SIZE,
          height: BASE_SIZE,
          left: -BASE_SIZE / 2,
          top: -BASE_SIZE / 2,
          scale,
          willChange: "transform",
        }}
      />
      <motion.span
        className="absolute flex items-center justify-center text-[10px] font-medium uppercase tracking-widest2 text-obsidian-950"
        style={{
          width: BASE_SIZE,
          height: BASE_SIZE,
          left: -BASE_SIZE / 2,
          top: -BASE_SIZE / 2,
          opacity: labelOpacity,
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
