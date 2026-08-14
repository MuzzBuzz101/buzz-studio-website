/**
 * Monthly Content Retainer — homepage section copy & structure.
 * Tier cards describe deliverables only (no public TL package prices).
 * Budget ranges live on the qualification form only.
 */

export type RetainerTierId = "growth" | "scale";

export const retainerContent = {
  id: "retainer",
  eyebrow: "Monthly Content Retainer",
  brand: "Buzz Studio",

  hero: {
    headline:
      "Stop Chasing One-Off Shoots. Get Continuous, High-End Visuals Every Single Month.",
    sub: "Partner with Buzz Studio on a flexible monthly retainer. We handle storyboards, 4K production, lighting, DaVinci Resolve color grading, and delivery—giving your brand a steady engine of scroll-stopping visual content without the high cost of an in-house production team.",
    primaryCta: { label: "Reserve Your Monthly Production Slot", href: "#retainer-form" },
    secondaryCta: { label: "See How It Works", href: "#retainer-steps" },
  },

  problem: {
    eyebrow: "The Gap",
    heading: "The Social Content Dilemma: Quality vs. Consistency",
    intro:
      "Most brands get stuck choosing between craft and cadence. A retainer closes both.",
    choices: [
      {
        id: "in-house",
        title: "Build an internal team",
        description:
          "Salaries, gear, editing suites, and management overhead—before a single frame ships. Expensive, slow to staff, hard to keep cinema-grade.",
      },
      {
        id: "phone",
        title: "Rely on phone clips",
        description:
          "Fast and cheap, but inconsistent lighting, weak grade, and no narrative spine. Feeds fill—authority doesn't.",
      },
    ],
    advantage: {
      title: "The retainer advantage",
      description:
        "Cinema-grade craft on a monthly cadence—storyboards, 4K production, intentional lighting, and DaVinci Resolve grading, delivered on a predictable rhythm.",
    },
    benefits: [
      {
        title: "Zero Production Headaches",
        description:
          "Brief once. We handle planning, shoot day, post, and delivery so your team stays on brand—not on set.",
      },
      {
        title: "Predictable Costs",
        description:
          "One monthly engagement instead of endless one-off quotes. Scope stays clear; spend stays steady.",
      },
      {
        title: "Multi-Platform Deliverables",
        description:
          "Short-form 9:16 for social and cinematic 16:9 highlights—formatted for every surface that matters.",
      },
    ],
  },

  tiers: {
    eyebrow: "Packages",
    heading: "Predictable Pricing Built for Growth",
    note: "Deliverables outlined below. Strategy call confirms fit and monthly scope.",
    items: [
      {
        id: "growth" as const,
        name: "Growth Retainer",
        audience: "Local restaurants, cafes & boutiques",
        popular: false,
        deliverables: [
          "1 shoot day per month",
          "4 short-form videos",
          "15 still photographs",
          "Pro lighting, audio & DaVinci Resolve grade",
          "5 business day turnaround",
        ],
        cta: "Select Growth Tier",
        preview: {
          videoSrc: "/videos/case-studies/raccoon-restaurant.mp4",
          poster: "/images/projects/raccoon-restaurant/cover.jpg",
          label: "Raccoon Restaurant",
        },
      },
      {
        id: "scale" as const,
        name: "Scale Retainer",
        audience: "Growing brands ready for a full monthly content engine",
        popular: true,
        badge: "Most Popular",
        deliverables: [
          "2 shoot days per month",
          "8 short-form videos",
          "1 cinematic 16:9 highlight",
          "30 still photographs",
          "Creative direction, storyboarding & music licensing",
          "3–5 business day turnaround",
        ],
        cta: "Select Scale Tier",
        preview: {
          videoSrc: "/videos/case-studies/lombard-walk-of-fame-cafe.mp4",
          poster: "/images/projects/lombard-walk-of-fame-cafe/cover.jpg",
          label: "Lombard & Walk Of Fame",
        },
      },
    ],
  },

  steps: {
    id: "retainer-steps",
    eyebrow: "Process",
    heading: "How It Works",
    items: [
      {
        index: "01",
        title: "Strategy & Content Plan",
        description:
          "We map your brand voice, platforms, and monthly themes—then lock a content calendar before cameras roll.",
      },
      {
        index: "02",
        title: "The Production Day",
        description:
          "Sony A7 IV, gimbals, macro, and pro lights on site. We move quietly and don't disrupt your operations.",
      },
      {
        index: "03",
        title: "Post-Production & Grading",
        description:
          "Edit, sound design, and DaVinci Resolve color—polished frames with a consistent cinematic look month after month.",
      },
      {
        index: "04",
        title: "Delivery & Asset Library",
        description:
          "Organized deliverables in 9:16 and 16:9, ready to publish—plus an accumulating library your team can draw from anytime.",
      },
    ],
  },

  proof: {
    eyebrow: "In the field",
    quote:
      "Continuous F&B visuals that lifted engagement and sharpened brand perception—without hiring an in-house crew.",
    client: "Lombard & Walk Of Fame",
    engagement: "Monthly Content Retainer",
    href: "/work/lombard-walk-of-fame-cafe",
    cover: "/images/projects/lombard-walk-of-fame-cafe/cover.jpg",
  },

  form: {
    id: "retainer-form",
    eyebrow: "Qualification",
    heading: "Ready to Elevate Your Brand's Visuals? Let's Talk.",
    scarcity:
      "Only 3 new retainer clients are accepted per quarter to protect production quality.",
    industries: [
      "Food & Beverage",
      "Real Estate",
      "Fashion & DTC",
      "Music & Entertainment",
      "Other",
    ] as const,
    budgets: [
      {
        id: "a",
        label: "5,000–10,000 TL / month",
        value: "5,000–10,000 TL",
      },
      {
        id: "b",
        label: "10,000–25,000 TL / month",
        value: "10,000–25,000 TL",
      },
      {
        id: "c",
        label: "25,000 TL+ / month",
        value: "25,000 TL+",
      },
    ] as const,
    submitLabel: "Request Retainer Strategy Call",
    success: {
      title: "Request received — we'll be in touch.",
      body: "Your retainer inquiry is with the studio. We'll review fit and reach out to schedule a strategy call.",
    },
  },
} as const;

export type RetainerIndustry = (typeof retainerContent.form.industries)[number];
export type RetainerBudgetValue = (typeof retainerContent.form.budgets)[number]["value"];
