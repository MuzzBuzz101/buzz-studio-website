import { InquiryType } from "@/types";

export const siteConfig = {
  name: "BUZZ",
  fullName: "Buzz Studio",
  ownerName: "Syed Muzammil Shah Kazmi",
  role: "Creative Producer | Multimedia Content Creator & Editor",
  heroTitle: "Creative Producer",
  heroSubtitle: "Multimedia Content Creator & Editor",
  tagline: "Creative Producer — Video, Photography & Post-Production",
  description:
    "Creative Producer and Multimedia Content Creator with 5+ years handling the full production pipeline — cinematography, commercial photography, editing, and DaVinci Resolve color grading — for food & beverage, real estate, fashion, and music clients.",
  url: "https://buzzstudiosai.com",
  email: "shahkazim2016@gmail.com",
  phone: "+90 539 138 73 74",
  /** E.164 digits for tel/sms links (no spaces). */
  phoneE164: "+905391387374",
  sms: "sms:+905391387374",
  whatsapp: "https://wa.me/905391387374",
  location: "Lefke, Cyprus",
  socials: [
    { label: "Instagram", href: "https://instagram.com/buzz_studio101" },
    { label: "LinkedIn", href: "https://linkedin.com/in/syed-muzammil-shah-kazmi" },
  ],
};

/**
 * Hero background video rotation — plays each clip through to the end, then
 * cross-fades into the next one. Horizontal (16:9) clips only, since the hero
 * is a full-bleed landscape strip and vertical (9:16) clips would need heavy
 * cropping. Reuses the already-compressed case-study films, one clip
 * downloaded at a time (see <HeroVideoRotator>), so it never blocks initial
 * page load. Keyvant and Lombard are vertical (9:16) — see their own case
 * study pages instead.
 */
export const heroVideos = [
  "/videos/case-studies/shawn-x-music-video.mp4",
  "/videos/case-studies/raccoon-restaurant.mp4",
  "/videos/case-studies/ak-reel.mp4",
  "/videos/case-studies/sammier-blue.mp4",
  "/videos/case-studies/faizan-sport.mp4",
  "/videos/case-studies/cinematic-reel.mp4",
  "/videos/case-studies/aaignaish-moon.mp4",
  "/videos/case-studies/alina-cinematic.mp4",
  "/videos/case-studies/rue-cinematics.mp4",
];

/** Fallback photo rotation, used only if `heroVideos` is ever cleared out. */
export const heroImages = [
  "/images/projects/shawn-x-music-video/cover.jpg",
  "/images/projects/ladre-lookbook/03.jpg",
  "/images/projects/graduation-portraits/02.jpg",
  "/images/stills/events-and-graduation/12.jpg",
  "/images/projects/ladre-lookbook/cover.jpg",
  "/images/projects/sammier-blue/cover.jpg",
  "/images/projects/birthday-event/cover.jpg",
];

export const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "Motion / Stills", href: "/#motion-stills" },
  { label: "Pipeline", href: "/#pipeline" },
  { label: "About", href: "/#about" },
  { label: "Proposal", href: "/#proposal" },
  { label: "Contact", href: "/#contact" },
];

export const inquiryTypes: InquiryType[] = [
  "Food & Beverage",
  "Music Video",
  "Real Estate",
  "Fashion",
  "Cinematic",
  "Events & Portraits",
  "Post-Production",
  "Photography",
  "Other",
];
