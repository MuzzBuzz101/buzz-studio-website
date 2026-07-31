import Link from "next/link";
import { navLinks, siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container flex flex-col items-center gap-6 text-sm text-obsidian-400 md:flex-row md:justify-between">
        <span className="font-display text-lg tracking-[0.2em] text-obsidian-200">
          {siteConfig.name}
        </span>

        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor="hover"
              className="uppercase tracking-widest2 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          {siteConfig.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="transition-colors hover:text-white"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
      <div className="container mt-8 border-t border-white/5 pt-6 text-center text-xs text-obsidian-500">
        © {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
      </div>
    </footer>
  );
}
