export type ProjectCategory =
  | "Food & Beverage"
  | "Music Video"
  | "Real Estate"
  | "Fashion"
  | "Events & Portraits";

export type Role =
  | "Creative Director"
  | "Cinematographer"
  | "Videographer"
  | "Editor"
  | "Colorist"
  | "Photographer";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface ProjectSpecs {
  client: string;
  deliverable: string;
  gear: string[];
  postTools: string[];
  location?: string;
  duration?: string;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  category: ProjectCategory;
  roles: Role[];
  year: number;
  coverImage: string;
  coverVideo?: string;
  thumbnailVideo?: string;
  synopsis: string;
  description: string;
  vimeoId?: string;
  featured: boolean;
  specs: ProjectSpecs;
  gallery: GalleryImage[];
  roleCallout: string;
}

export type StillCategory = "Food & Product" | "Fashion & Portraits" | "Events & Graduation";

export interface StillPhoto {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: StillCategory;
  camera?: string;
  lens?: string;
  lighting?: string;
  location?: string;
  year: number;
}

export interface CapabilityPillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  index: string;
}

export interface GearCategory {
  category: string;
  items: string[];
}

export interface ClientLogo {
  id: string;
  name: string;
}

/** A quantifiable career highlight — retainer values, campaign volume, experience, etc. */
export interface Highlight {
  id: string;
  title: string;
  organization: string;
  year: number;
}

export type InquiryType =
  | "Food & Beverage"
  | "Music Video"
  | "Real Estate"
  | "Fashion"
  | "Post-Production"
  | "Photography"
  | "Other";
