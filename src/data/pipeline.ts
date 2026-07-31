import { CapabilityPillar, ClientLogo, GearCategory, Highlight } from "@/types";

export const capabilityPillars: CapabilityPillar[] = [
  {
    id: "video-production",
    index: "01",
    title: "Video Production & Cinematography",
    description:
      "Visual frameworks, storyboarding, cinematic camera tracking, low-light lighting, music-video direction, and high-engagement commercial reels.",
    icon: "clapperboard",
  },
  {
    id: "photography",
    index: "02",
    title: "Commercial & Event Photography",
    description:
      "Food styling and menu photography, high-end fashion campaigns, model portfolios, and high-volume graduation portraiture.",
    icon: "camera",
  },
  {
    id: "post",
    index: "03",
    title: "Post-Production & Editing",
    description:
      "Advanced multi-cam editing, narrative pacing, custom sound design, asset management, and DaVinci Resolve color grading.",
    icon: "sliders-horizontal",
  },
  {
    id: "retainers",
    index: "04",
    title: "Client Retainer Management",
    description:
      "Onboarding, custom production agreements, client communications, and consistent monthly content deliverable calendars.",
    icon: "handshake",
  },
];

export const gearManifest: GearCategory[] = [
  {
    category: "Camera & Lenses",
    items: ["Sony A7 IV Mirrorless", "50mm Prime Lens", "85mm Macro Lens"],
  },
  {
    category: "Lighting & Stabilization",
    items: ["Continuous Studio Lighting", "Electronic Stabilization Gimbal"],
  },
  {
    category: "Audio",
    items: ["Wireless Lavalier Systems", "On-Camera Wireless Receivers"],
  },
  {
    category: "Editing & Color",
    items: ["DaVinci Resolve", "CapCut"],
  },
  {
    category: "Photo & Design",
    items: ["Adobe Lightroom", "Adobe Photoshop", "Adobe Illustrator", "Figma"],
  },
];

export const clientLogos: ClientLogo[] = [
  { id: "c1", name: "Raccoon Restaurant" },
  { id: "c2", name: "Big Bites Fast Food" },
  { id: "c3", name: "Shawn X" },
  { id: "c4", name: "Lombard & Walk Of Fame Cafe" },
  { id: "c5", name: "Keyvant Real Estate" },
  { id: "c6", name: "LADRE" },
  { id: "c7", name: "Blockchain Agency" },
  { id: "c8", name: "Growth Sync" },
];

export const highlights: Highlight[] = [
  { id: "h1", title: "5+ Years", organization: "Creative Production & Content Experience", year: 2026 },
  { id: "h2", title: "14,000 TL Campaign", organization: "Raccoon Restaurant — Menu Production", year: 2023 },
  { id: "h3", title: "8-Video Bundle", organization: "Shawn X — 10,000 TL Promotional Rollout", year: 2022 },
  { id: "h4", title: "15–20 Portraits / Cycle", organization: "Graduation Photography, EUL", year: 2024 },
];
