import Image from "next/image";
import { GalleryImage, Project } from "@/types";
import { Reveal } from "@/components/ui/reveal";

export function RevealHeader({ project }: { project: Project }) {
  return (
    <div className="mt-8 animate-fade-up">
      <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
        {project.client} · {project.year}
      </p>
      <h1 className="mt-4 max-w-4xl font-display text-fluid-xl leading-[1.02] text-white">
        {project.title}
      </h1>
      <p className="mt-4 text-sm uppercase tracking-widest2 text-obsidian-400">
        {project.roles.join(" / ")}
      </p>
    </div>
  );
}

export function RevealGallery({ gallery }: { gallery: GalleryImage[] }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {gallery.map((image, i) => (
        <Reveal key={image.id} delay={(i % 6) * 60} className="mb-4 break-inside-avoid">
          <div className="overflow-hidden rounded-lg bg-obsidian-800">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
              className="w-full object-cover"
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
