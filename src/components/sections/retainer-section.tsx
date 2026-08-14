"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  retainerContent,
  type RetainerTierId,
} from "@/data/retainer";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

function TierPreview({
  videoSrc,
  poster,
  label,
}: {
  videoSrc: string;
  poster: string;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          videoRef.current?.pause();
          return;
        }
        setShouldLoad(true);
        const el = videoRef.current;
        if (el) {
          el.play().catch(() => {});
        }
      },
      { rootMargin: "80px 0px", threshold: 0.15 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => {});
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="relative mt-8 aspect-video overflow-hidden rounded-sm border border-white/10 bg-obsidian-900"
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 40vw"
        className={cn(
          "object-cover transition-opacity duration-700",
          shouldLoad ? "opacity-0" : "opacity-70"
        )}
      />
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          aria-label={`${label} preview`}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-950/50 via-transparent to-transparent"
      />
    </div>
  );
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function RetainerSection() {
  const c = retainerContent;
  const [selectedTier, setSelectedTier] = useState<RetainerTierId | "">("");
  const [industry, setIndustry] = useState<string | undefined>(undefined);
  const [budget, setBudget] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const selectTier = (tier: RetainerTierId) => {
    setSelectedTier(tier);
    scrollToId(c.form.id);
    window.setTimeout(() => {
      formRef.current
        ?.querySelector<HTMLInputElement>("input[name='name']")
        ?.focus();
    }, 450);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const name = String(form.get("name") || "").trim();
    const businessName = String(form.get("businessName") || "").trim();
    const email = String(form.get("email") || "").trim();
    const goals = String(form.get("goals") || "").trim();
    const tier =
      selectedTier === "growth"
        ? "Growth Retainer"
        : selectedTier === "scale"
          ? "Scale Retainer"
          : undefined;

    if (!industry || !budget) {
      setStatus("error");
      setErrorMessage("Please select an industry and monthly content budget.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    const messageParts = [
      businessName ? `Business: ${businessName}` : null,
      industry ? `Industry: ${industry}` : null,
      budget ? `Monthly budget: ${budget}` : null,
      tier ? `Preferred tier: ${tier}` : null,
      goals ? `Goals:\n${goals}` : null,
    ].filter(Boolean);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          inquiryType: "Monthly Retainer",
          projectType: "Monthly Retainer",
          message: messageParts.join("\n\n"),
          meta: {
            source: "retainer-form",
            businessName,
            industry,
            budget,
            goals,
            tier: tier || null,
            tierId: selectedTier || null,
          },
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Could not send retainer request.");
      }

      setStatus("success");
      formEl.reset();
      setIndustry(undefined);
      setBudget(undefined);
      setSelectedTier("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not send request. Please try again or email us directly."
      );
    }
  };

  return (
    <section
      id={c.id}
      className="relative overflow-hidden border-t border-white/10 py-28 md:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(212,175,55,0.08),transparent_48%),radial-gradient(ellipse_at_85%_40%,rgba(255,255,255,0.03),transparent_42%)]"
      />

      <div className="container relative">
        {/* Hero */}
        <div className="mb-24 grid items-end gap-12 lg:mb-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
              {c.eyebrow}
            </p>
            <p className="mt-5 font-display text-2xl tracking-wide text-accent-soft md:text-3xl">
              {c.brand}
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-fluid-xl leading-[1.05] text-white">
              Stop Chasing One-Off Shoots.{" "}
              <span className="text-gradient-silver italic">
                Get Continuous, High-End Visuals
              </span>{" "}
              Every Single Month.
            </h2>
            <p className="mt-8 max-w-xl text-obsidian-300">{c.hero.sub}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  scrollToId(c.form.id);
                  window.setTimeout(() => {
                    formRef.current
                      ?.querySelector<HTMLInputElement>("input[name='name']")
                      ?.focus();
                  }, 450);
                }}
              >
                {c.hero.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => scrollToId(c.steps.id)}
              >
                {c.hero.secondaryCta.label}
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 md:aspect-[3/4]">
              <Image
                src={c.proof.cover}
                alt="Buzz Studio monthly retainer visuals — Lombard & Walk Of Fame"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center opacity-90"
                quality={90}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-obsidian-950/10 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-widest2 text-accent">
                  Continuous production
                </p>
                <p className="mt-2 font-display text-xl text-white md:text-2xl">
                  Monthly visual engine
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Problem & solution */}
        <div className="mb-24 md:mb-32">
          <Reveal>
            <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
              {c.problem.eyebrow}
            </p>
            <h3 className="mt-4 max-w-2xl font-display text-fluid-lg leading-[1.1] text-white">
              {c.problem.heading}
            </h3>
            <p className="mt-5 max-w-lg text-obsidian-300">{c.problem.intro}</p>
          </Reveal>

          <div className="mt-14 grid gap-0 border-t border-white/10 md:grid-cols-2">
            {c.problem.choices.map((choice, i) => (
              <Reveal key={choice.id} delay={i * 80}>
                <div
                  className={cn(
                    "border-b border-white/10 py-10 md:px-8 md:py-12",
                    i === 0 && "md:border-r md:pl-0",
                    i === 1 && "md:pr-0"
                  )}
                >
                  <span className="font-mono text-xs text-obsidian-500">
                    0{i + 1}
                  </span>
                  <h4 className="mt-4 font-display text-2xl text-white md:text-3xl">
                    {choice.title}
                  </h4>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-obsidian-300 md:text-base">
                    {choice.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100} className="mt-10 rounded-2xl border border-accent/25 bg-accent/[0.04] p-8 md:p-10">
            <p className="font-mono text-xs uppercase tracking-widest2 text-accent">
              {c.problem.advantage.title}
            </p>
            <p className="mt-4 max-w-3xl font-display text-xl leading-snug text-white md:text-2xl">
              {c.problem.advantage.description}
            </p>
          </Reveal>

          <ul className="mt-14 grid gap-10 border-t border-white/10 pt-12 md:grid-cols-3 md:gap-8">
            {c.problem.benefits.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 70}>
                <li>
                  <h4 className="font-display text-xl text-white md:text-2xl">
                    {benefit.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-obsidian-300">
                    {benefit.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Tiers */}
        <div className="mb-24 md:mb-32">
          <Reveal>
            <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
              {c.tiers.eyebrow}
            </p>
            <h3 className="mt-4 max-w-2xl font-display text-fluid-lg leading-[1.1] text-white">
              {c.tiers.heading}
            </h3>
            <p className="mt-4 max-w-md text-sm text-obsidian-400">{c.tiers.note}</p>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {c.tiers.items.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 100}>
                <article
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white/[0.02] p-7 md:p-9",
                    tier.popular
                      ? "border-accent/40 shadow-[0_0_60px_-28px_rgba(212,175,55,0.45)]"
                      : "border-white/10"
                  )}
                >
                  {tier.popular && "badge" in tier && tier.badge ? (
                    <span className="absolute right-7 top-7 rounded-full border border-accent/50 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 text-accent-soft md:right-9 md:top-9">
                      {tier.badge}
                    </span>
                  ) : null}

                  <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
                    {tier.audience}
                  </p>
                  <h4 className="mt-4 font-display text-3xl text-white md:text-4xl">
                    {tier.name}
                  </h4>

                  <ul className="mt-8 space-y-3 border-t border-white/10 pt-8">
                    {tier.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm text-obsidian-200"
                      >
                        <span
                          aria-hidden
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <TierPreview
                    videoSrc={tier.preview.videoSrc}
                    poster={tier.preview.poster}
                    label={tier.preview.label}
                  />

                  <div className="mt-8">
                    <Button
                      type="button"
                      size="lg"
                      variant={tier.popular ? "primary" : "outline"}
                      className="w-full sm:w-auto"
                      onClick={() => selectTier(tier.id)}
                    >
                      {tier.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div id={c.steps.id} className="mb-24 scroll-mt-28 md:mb-32">
          <Reveal>
            <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
              {c.steps.eyebrow}
            </p>
            <h3 className="mt-4 max-w-xl font-display text-fluid-lg leading-[1.1] text-white">
              {c.steps.heading}
            </h3>
          </Reveal>

          <ol className="mt-14 grid gap-0 border-t border-white/10 md:grid-cols-4">
            {c.steps.items.map((step, i) => (
              <li
                key={step.index}
                className={cn(
                  "border-b border-white/10 py-8 md:border-b-0 md:px-6 md:py-10",
                  i < c.steps.items.length - 1 && "md:border-r",
                  i === 0 && "md:pl-0",
                  i === c.steps.items.length - 1 && "md:pr-0"
                )}
              >
                <Reveal delay={i * 90}>
                  <span className="font-mono text-xs text-accent">{step.index}</span>
                  <h4 className="mt-4 font-display text-xl text-white md:text-2xl">
                    {step.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-obsidian-300">
                    {step.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {/* Proof */}
        <Reveal className="mb-24 md:mb-32">
          <div className="grid items-center gap-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] lg:grid-cols-[0.95fr_1.05fr] lg:gap-0">
            <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={c.proof.cover}
                alt={`${c.proof.client} — retainer case`}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-transparent to-obsidian-950/40 max-lg:bg-gradient-to-t max-lg:from-obsidian-950/70 max-lg:to-transparent"
              />
            </div>
            <div className="p-8 md:p-12 lg:p-14">
              <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
                {c.proof.eyebrow}
              </p>
              <blockquote className="mt-6 font-display text-2xl leading-snug text-white md:text-3xl">
                &ldquo;{c.proof.quote}&rdquo;
              </blockquote>
              <p className="mt-8 text-sm text-obsidian-200">
                <span className="text-white">{c.proof.client}</span>
                <span className="text-obsidian-500"> — </span>
                {c.proof.engagement}
              </p>
              <Link
                href={c.proof.href}
                data-cursor="hover"
                className="mt-8 inline-flex items-center gap-2 text-sm text-accent-soft transition-colors hover:text-accent"
              >
                View the work
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Qualification form */}
        <div id={c.form.id} className="scroll-mt-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
                {c.form.eyebrow}
              </p>
              <h3 className="mt-4 font-display text-fluid-lg leading-[1.1] text-white">
                Ready to Elevate Your Brand&rsquo;s Visuals?{" "}
                <span className="text-gradient-silver italic">Let&rsquo;s Talk.</span>
              </h3>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-obsidian-300">
                {c.form.scarcity}
              </p>
              {selectedTier ? (
                <p className="mt-8 inline-flex items-center gap-2 border-l-2 border-accent pl-4 text-sm text-obsidian-200">
                  Selected:{" "}
                  <span className="text-accent-soft">
                    {selectedTier === "growth" ? "Growth Retainer" : "Scale Retainer"}
                  </span>
                </p>
              ) : null}
            </Reveal>

            <Reveal delay={100}>
              {status === "success" ? (
                <div className="glass rounded-2xl p-6 md:p-10">
                  <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
                    Retainer inquiry received
                  </p>
                  <h4 className="mt-4 font-display text-3xl text-white">
                    {c.form.success.title}
                  </h4>
                  <p className="mt-4 max-w-md text-sm text-obsidian-300">
                    {c.form.success.body}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-8"
                    onClick={() => setStatus("idle")}
                  >
                    Submit another request
                  </Button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="glass rounded-2xl p-6 md:p-10"
                >
                  <input type="hidden" name="tier" value={selectedTier} />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="retainer-name"
                        className="text-xs uppercase tracking-widest2 text-obsidian-400"
                      >
                        Full Name
                      </label>
                      <input
                        id="retainer-name"
                        name="name"
                        required
                        placeholder="Your full name"
                        className="h-14 rounded-lg border border-white/15 bg-white/[0.02] px-4 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="retainer-business"
                        className="text-xs uppercase tracking-widest2 text-obsidian-400"
                      >
                        Business / Brand Name
                      </label>
                      <input
                        id="retainer-business"
                        name="businessName"
                        required
                        placeholder="Your brand"
                        className="h-14 rounded-lg border border-white/15 bg-white/[0.02] px-4 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label
                        htmlFor="retainer-email"
                        className="text-xs uppercase tracking-widest2 text-obsidian-400"
                      >
                        Email
                      </label>
                      <input
                        id="retainer-email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        className="h-14 rounded-lg border border-white/15 bg-white/[0.02] px-4 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-widest2 text-obsidian-400">
                        Industry
                      </label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {c.form.industries.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-widest2 text-obsidian-400">
                        Monthly Content Budget
                      </label>
                      <Select value={budget} onValueChange={setBudget}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {c.form.budgets.map((item) => (
                            <SelectItem key={item.id} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label
                        htmlFor="retainer-goals"
                        className="text-xs uppercase tracking-widest2 text-obsidian-400"
                      >
                        Goals
                      </label>
                      <textarea
                        id="retainer-goals"
                        name="goals"
                        required
                        rows={4}
                        placeholder="What should this retainer unlock for your brand?"
                        className="resize-none rounded-lg border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                      />
                    </div>
                  </div>

                  {status === "error" && errorMessage ? (
                    <p className="mt-4 text-sm text-red-300" role="alert">
                      {errorMessage}{" "}
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="underline underline-offset-2 hover:text-white"
                      >
                        Email us instead
                      </a>
                      .
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    className="mt-8 w-full sm:w-auto"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting"
                      ? "Sending…"
                      : c.form.submitLabel}
                  </Button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
