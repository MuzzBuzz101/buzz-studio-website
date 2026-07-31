import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "shawn-x-music-video",
    title: "Shawn X — Rollout",
    client: "Artist Shawn X",
    category: "Music Video",
    roles: ["Creative Director", "Cinematographer", "Editor", "Colorist"],
    year: 2022,
    coverImage: "/images/projects/midnight-echelon/cover.jpg",
    synopsis:
      "A multi-stage content rollout for independent artist Shawn X — an original cinematic music video followed by an 8-video promotional bundle.",
    description:
      "Scripted, directed, and executed end-to-end for artist Shawn X: an independent cinematic music video, an 8-video promotional bundle delivered for 10,000 TL, and an ongoing monthly contract covering long-form videos, micro-reels, and portrait sessions. Handled everything from concept and shot-listing through DaVinci Resolve color grading on a Sony A7 IV with prime glass.",
    vimeoId: "76979871",
    featured: true,
    specs: {
      client: "Artist Shawn X",
      deliverable: "Music Video + 8-Video Promotional Bundle (10,000 TL) + Monthly Retainer",
      gear: ["Sony A7 IV", "50mm Prime Lens", "Electronic Gimbal", "Wireless Lavalier Audio"],
      postTools: ["DaVinci Resolve", "CapCut", "Adobe Lightroom"],
      location: "Lefke, Cyprus",
      duration: "Ongoing Monthly Contract",
    },
    roleCallout: "Full Pipeline: Scripted, Directed, Shot, Edited & Color Graded",
    gallery: [
      { id: "shawn-1", src: "/images/projects/midnight-echelon/01.jpg", alt: "Music video lighting setup", width: 1200, height: 750 },
      { id: "shawn-2", src: "/images/projects/midnight-echelon/02.jpg", alt: "Artist portrait session", width: 900, height: 1200 },
      { id: "shawn-3", src: "/images/projects/midnight-echelon/03.jpg", alt: "Camera rig on gimbal", width: 1200, height: 800 },
      { id: "shawn-4", src: "/images/projects/midnight-echelon/04.jpg", alt: "On-set behind the scenes", width: 1200, height: 750 },
    ],
  },
  {
    slug: "raccoon-restaurant",
    title: "Raccoon Restaurant — Menu Campaign",
    client: "Raccoon Restaurant",
    category: "Food & Beverage",
    roles: ["Creative Director", "Cinematographer", "Editor", "Colorist", "Photographer"],
    year: 2023,
    coverImage: "/images/projects/aurum-timepieces/cover.jpg",
    synopsis:
      "A multi-tiered menu production campaign pairing cinematic reels with macro food photography, valued at 14,000 TL.",
    description:
      "Engineered a full menu production campaign for Raccoon Restaurant — cinematic reels and macro-lens food photography designed to make every dish read as premium across social and in-venue menu boards. Shot on a Sony A7 IV with an 85mm macro lens under continuous studio lighting, graded in DaVinci Resolve for warm, appetite-driving color.",
    vimeoId: "76979871",
    featured: true,
    specs: {
      client: "Raccoon Restaurant",
      deliverable: "Multi-Tiered Menu Campaign — Reels + Macro Photography (Valued at 14,000 TL)",
      gear: ["Sony A7 IV", "85mm Macro Lens", "Continuous Studio Lighting", "Electronic Gimbal"],
      postTools: ["DaVinci Resolve", "Adobe Lightroom", "CapCut"],
      location: "Lefke, Cyprus",
      duration: "Multi-Tiered Campaign",
    },
    roleCallout: "Full Pipeline: Directed, Shot, Edited & Color Graded",
    gallery: [
      { id: "raccoon-1", src: "/images/projects/aurum-timepieces/01.jpg", alt: "Macro shot of plated dish", width: 1200, height: 800 },
      { id: "raccoon-2", src: "/images/projects/aurum-timepieces/02.jpg", alt: "Food styling on set", width: 900, height: 1200 },
      { id: "raccoon-3", src: "/images/projects/aurum-timepieces/03.jpg", alt: "Studio lighting setup for menu shoot", width: 1200, height: 750 },
    ],
  },
  {
    slug: "keyvant-real-estate",
    title: "Keyvant — Handover Series",
    client: "Keyvant Real Estate Management",
    category: "Real Estate",
    roles: ["Creative Director", "Cinematographer", "Editor"],
    year: 2023,
    coverImage: "/images/projects/salt-and-static/cover.jpg",
    synopsis:
      "A multi-part cinematic handover campaign covering quality checks and building handovers, plus a teaser for an upcoming interior design series.",
    description:
      "Produced a multi-part cinematic video series for Keyvant Real Estate Management documenting property quality checks and unit handovers to buyers — building trust through transparent, well-shot walkthroughs. The series closes with a teaser trailer for an upcoming interior design showcase, shot with a gimbal-stabilized Sony A7 IV to keep long walkthrough takes smooth.",
    vimeoId: "76979871",
    featured: true,
    specs: {
      client: "Keyvant Real Estate Management",
      deliverable: "Multi-Part Handover Series + Interior Design Teaser",
      gear: ["Sony A7 IV", "50mm Prime Lens", "Electronic Gimbal"],
      postTools: ["DaVinci Resolve", "CapCut"],
      location: "Lefke, Cyprus",
      duration: "Multi-Part Series",
    },
    roleCallout: "Directed, Shot & Edited",
    gallery: [
      { id: "keyvant-1", src: "/images/projects/salt-and-static/01.jpg", alt: "Building exterior handover shot", width: 1200, height: 800 },
      { id: "keyvant-2", src: "/images/projects/salt-and-static/02.jpg", alt: "Interior walkthrough", width: 900, height: 1200 },
      { id: "keyvant-3", src: "/images/projects/salt-and-static/03.jpg", alt: "Wide shot of property", width: 1200, height: 750 },
      { id: "keyvant-4", src: "/images/projects/salt-and-static/04.jpg", alt: "Quality check on-site", width: 1200, height: 800 },
    ],
  },
  {
    slug: "ladre-lookbook",
    title: "LADRE — Style Reel & Lookbook",
    client: "LADRE",
    category: "Fashion",
    roles: ["Creative Director", "Cinematographer", "Photographer", "Editor"],
    year: 2023,
    coverImage: "/images/projects/kinetic/cover.jpg",
    synopsis:
      "A high-end style reel and lookbook campaign for clothing brand LADRE that drove viral organic reach on Instagram.",
    description:
      "Conceptualized and shot a full style reel and lookbook campaign for fashion brand LADRE — model direction, wardrobe styling coordination, and a fast-cut social edit designed for maximum organic reach. The campaign combined motion reels with a stills lookbook, both shot on a Sony A7 IV with 50mm and 85mm macro glass and graded to match the brand's editorial palette.",
    vimeoId: "76979871",
    featured: true,
    specs: {
      client: "LADRE",
      deliverable: "Style Reel + Full Lookbook Campaign",
      gear: ["Sony A7 IV", "50mm Prime Lens", "85mm Macro Lens", "Continuous Studio Lighting"],
      postTools: ["DaVinci Resolve", "Adobe Lightroom", "Adobe Photoshop", "CapCut"],
      location: "Lefke, Cyprus",
      duration: "Campaign",
    },
    roleCallout: "Full Pipeline: Conceptualized, Shot, Edited & Graded",
    gallery: [
      { id: "ladre-1", src: "/images/projects/kinetic/01.jpg", alt: "Fashion lookbook shot", width: 1200, height: 800 },
      { id: "ladre-2", src: "/images/projects/kinetic/02.jpg", alt: "Model portrait on set", width: 900, height: 1200 },
      { id: "ladre-3", src: "/images/projects/kinetic/03.jpg", alt: "Style reel behind the scenes", width: 1200, height: 750 },
    ],
  },
  {
    slug: "big-bites-fast-food",
    title: "Big Bites — HD Menu Campaign",
    client: "Big Bites Fast Food",
    category: "Food & Beverage",
    roles: ["Creative Director", "Cinematographer", "Photographer", "Editor"],
    year: 2022,
    coverImage: "/images/projects/glasshouse-sessions/cover.jpg",
    synopsis:
      "A high-definition food menu campaign spanning cinematic reels and macro photography across the full menu lineup.",
    description:
      "Directed a high-definition food menu campaign for Big Bites Fast Food covering burgers, doner, broast, and sides — cinematic reels paired with macro photography to make fast food read as craveable, high-quality content across delivery apps and social.",
    vimeoId: "76979871",
    featured: false,
    specs: {
      client: "Big Bites Fast Food",
      deliverable: "HD Food Menu Campaign — Reels + Macro Photography",
      gear: ["Sony A7 IV", "85mm Macro Lens", "Continuous Studio Lighting"],
      postTools: ["DaVinci Resolve", "Adobe Lightroom"],
      location: "Lefke, Cyprus",
      duration: "Full Menu Campaign",
    },
    roleCallout: "Directed, Shot & Edited",
    gallery: [
      { id: "bigbites-1", src: "/images/projects/glasshouse-sessions/01.jpg", alt: "Macro shot of burger", width: 1200, height: 800 },
      { id: "bigbites-2", src: "/images/projects/glasshouse-sessions/02.jpg", alt: "Food styling for menu shoot", width: 900, height: 1200 },
      { id: "bigbites-3", src: "/images/projects/glasshouse-sessions/03.jpg", alt: "Wide shot of kitchen set", width: 1200, height: 750 },
    ],
  },
  {
    slug: "graduation-portraits",
    title: "Graduation Portraiture Series",
    client: "European University of Lefke",
    category: "Events & Portraits",
    roles: ["Photographer", "Videographer", "Editor"],
    year: 2024,
    coverImage: "/images/projects/obsidian/cover.jpg",
    synopsis:
      "High-volume individual graduation portraiture and highlight-video packages across successive summer and winter campus cycles.",
    description:
      "Directed 15–20 individual graduation portrait and highlight-video packages per campus cycle, running a tight, repeatable shoot flow to deliver consistent, high-quality portraits and short recap videos for each graduate on a fast turnaround.",
    featured: false,
    specs: {
      client: "European University of Lefke",
      deliverable: "15–20 Portrait & Highlight-Video Packages per Cycle",
      gear: ["Sony A7 IV", "50mm Prime Lens", "Continuous Studio Lighting"],
      postTools: ["Adobe Lightroom", "DaVinci Resolve", "CapCut"],
      location: "Lefke, Cyprus",
      duration: "Seasonal Campaign",
    },
    roleCallout: "Photographed, Filmed & Edited",
    gallery: [
      { id: "grad-1", src: "/images/projects/obsidian/01.jpg", alt: "Graduation portrait session", width: 1200, height: 800 },
      { id: "grad-2", src: "/images/projects/obsidian/02.jpg", alt: "Campus portrait setup", width: 900, height: 1200 },
      { id: "grad-3", src: "/images/projects/obsidian/03.jpg", alt: "Highlight video behind the scenes", width: 1200, height: 750 },
    ],
  },
];

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAllSlugs() {
  return projects.map((p) => p.slug);
}
