"use client";

import { useState } from "react";
import { ArrowUpRight, Mail, MessageCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inquiryTypes, siteConfig } from "@/data/site";

const quickLinks = [
  { label: "Email", href: `mailto:${siteConfig.email}`, icon: Mail },
  { label: "Text", href: siteConfig.sms, icon: Smartphone },
  { label: "WhatsApp", href: siteConfig.whatsapp, icon: MessageCircle },
  { label: "Instagram", href: siteConfig.socials[0].href, icon: InstagramIcon },
  { label: "LinkedIn", href: siteConfig.socials[1].href, icon: LinkedInIcon },
];

export function ContactSection() {
  const [projectType, setProjectType] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const duration = form.get("duration");
    const message = form.get("message");

    const subject = encodeURIComponent(`New Inquiry — ${projectType || "General"}`);
    const durationLine = duration ? `Estimated Length: ${duration} minutes\n` : "";
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n${durationLine}\n${message}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative border-t border-white/10 py-28 md:py-40">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <Reveal>
            <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
              Inquiries &amp; Bookings
            </p>
            <h2 className="mt-6 font-display text-fluid-xl leading-[1.05] text-white">
              Let&rsquo;s make
              <br />
              something <span className="text-gradient-silver italic">unforgettable.</span>
            </h2>
            <p className="mt-8 max-w-md text-obsidian-300">
              Currently booking commercial retainers, music video, and photography projects for{" "}
              {new Date().getFullYear() + 1}. Based in {siteConfig.location}.
            </p>

            <div className="mt-12 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  data-cursor="hover"
                  className="group flex items-center justify-between border-b border-white/10 py-4 text-obsidian-200 transition-colors duration-300 hover:border-white/30 hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 -translate-y-0.5 translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-1">
                <label htmlFor="name" className="text-xs uppercase tracking-widest2 text-obsidian-400">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="Your full name"
                  className="h-14 rounded-lg border border-white/15 bg-white/[0.02] px-4 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-1">
                <label htmlFor="email" className="text-xs uppercase tracking-widest2 text-obsidian-400">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="h-14 rounded-lg border border-white/15 bg-white/[0.02] px-4 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs uppercase tracking-widest2 text-obsidian-400">
                  Project Type
                </label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {inquiryTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="duration" className="text-xs uppercase tracking-widest2 text-obsidian-400">
                  Estimated Video Length (minutes)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  placeholder="e.g. 3"
                  className="h-14 rounded-lg border border-white/15 bg-white/[0.02] px-4 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest2 text-obsidian-400">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your timeline, budget, and vision."
                  className="resize-none rounded-lg border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>
            </div>

              <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">
                {submitted ? "Opening your email client…" : "Send Inquiry"}
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
