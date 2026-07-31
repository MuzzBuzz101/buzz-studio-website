"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Scroll fires many times per second; only commit state on actual transitions
  // so the nav doesn't re-render on every frame.
  const scrolledRef = useRef(false);
  const hiddenRef = useRef(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    const nextScrolled = latest > 40;
    if (nextScrolled !== scrolledRef.current) {
      scrolledRef.current = nextScrolled;
      setScrolled(nextScrolled);
    }

    const nextHidden = latest > previous && latest > 200 && !menuOpen;
    if (nextHidden !== hiddenRef.current) {
      hiddenRef.current = nextHidden;
      setHidden(nextHidden);
    }
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled ? "glass" : "bg-transparent"
        )}
      >
        <div className="container flex h-20 items-center justify-between">
          <Link
            href="/"
            data-cursor="hover"
            className="font-display text-xl tracking-[0.2em] text-white"
          >
            {siteConfig.name}
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-cursor="hover"
                className="text-sm uppercase tracking-widest2 text-obsidian-300 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button asChild size="sm" variant="outline">
              <Link href="/#contact">Start a Project</Link>
            </Button>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            data-cursor="hover"
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center text-white md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[80] flex flex-col bg-obsidian-950 md:hidden"
          >
            <div className="container flex h-20 items-center justify-between">
              <span className="font-display text-xl tracking-[0.2em] text-white">
                {siteConfig.name}
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="container flex flex-1 flex-col justify-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-4xl text-obsidian-100"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.07, duration: 0.5 }}
                className="pt-6"
              >
                <Button asChild size="lg">
                  <Link href="/#contact" onClick={() => setMenuOpen(false)}>
                    Start a Project
                  </Link>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
