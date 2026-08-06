import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Project } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(date: string) {
  return new Date(date).getFullYear().toString();
}

/** Every distinct photo available for a project's cover — its cover shot plus gallery stills. */
export function getProjectCoverImages(project: Project): string[] {
  const images = new Set<string>();
  if (project.coverImage) images.add(project.coverImage);
  for (const photo of project.gallery) images.add(photo.src);
  return Array.from(images);
}
