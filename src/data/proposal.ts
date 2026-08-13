export const proposalPdfHref = "/docs/Buzz_Studio_Content_Proposal.pdf";

export const proposalPreviews = [
  {
    id: "cover",
    src: "/images/proposal/01-cover.jpg",
    alt: "Buzz Studio content proposal cover page",
    label: "Cover",
  },
  {
    id: "solution",
    src: "/images/proposal/02-solution.jpg",
    alt: "Proposal page outlining the cinematic solution",
    label: "Solution",
  },
  {
    id: "roadmap",
    src: "/images/proposal/03-roadmap.jpg",
    alt: "Proposal page showing the three-week growth roadmap",
    label: "Roadmap",
  },
  {
    id: "services",
    src: "/images/proposal/04-services.jpg",
    alt: "Proposal page listing premium services included",
    label: "Craft",
  },
] as const;

/** How presentations are structured — derived from the sample content proposal. */
export const proposalChapters = [
  {
    index: "01",
    title: "The Problem",
    description:
      "We name the market gap with precision — why generic content fails to stop the scroll, and what your brand is losing.",
  },
  {
    index: "02",
    title: "The Solution",
    description:
      "A cinematic answer: pro optics, immersive sound, intentional grade, and aerial context — framed as a clear creative thesis.",
  },
  {
    index: "03",
    title: "The Roadmap",
    description:
      "A week-by-week path from batch production to polished delivery, so stakeholders always know what happens next.",
  },
  {
    index: "04",
    title: "The Deliverables",
    description:
      "Packages itemized without ambiguity — reels, stills, and premium inclusions — so scope and investment stay transparent.",
  },
] as const;

/** Production cadence highlighted in the sample proposal. */
export const deliverySteps = [
  {
    index: "01",
    phase: "Week 1",
    title: "Production",
    description: "High-intensity batch shooting on location — efficient, focused, cinematic.",
  },
  {
    index: "02",
    phase: "Week 2",
    title: "Post-Production",
    description: "Editing, color grading, and sound syncing until every frame earns its place.",
  },
  {
    index: "03",
    phase: "Week 3",
    title: "Delivery",
    description: "The full monthly content set, organized and ready for the month ahead.",
  },
] as const;

export const proposalInclusions = [
  {
    title: "Drone Footage",
    description: "Aerial perspectives that place your brand in its true environment.",
  },
  {
    title: "Sound Design",
    description: "Custom audio mixing and immersive sync — the crunch, the pour, the room.",
  },
  {
    title: "Advanced Editing",
    description: "Seamless pacing, transitions, and effects built for premium feeds.",
  },
  {
    title: "Professional Grade",
    description: "Industry-standard optics and color so every asset feels intentional.",
  },
] as const;
