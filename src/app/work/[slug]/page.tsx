import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Clock } from "lucide-react";
import { VimeoEmbed } from "@/components/ui/vimeo-embed";
import { LocalVideoEmbed } from "@/components/ui/local-video-embed";
import { getAllSlugs, getProjectBySlug, projects } from "@/data/projects";
import { RevealGallery, RevealHeader } from "@/components/sections/case-study-reveal";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.synopsis,
    openGraph: {
      title: project.title,
      description: project.synopsis,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default function CaseStudyPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <article className="pb-28 pt-32 md:pb-40">
      <div className="container">
        <Link
          href="/#work"
          data-cursor="hover"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest2 text-obsidian-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Selected Works
        </Link>

        <RevealHeader project={project} />

        <div className="mt-10 md:mt-14">
          {project.videoSrc ? (
            <LocalVideoEmbed
              src={project.videoSrc}
              title={project.title}
              poster={project.coverImage}
              aspect={project.videoAspect}
            />
          ) : project.vimeoId ? (
            <VimeoEmbed
              vimeoId={project.vimeoId}
              title={project.title}
              poster={project.coverImage}
              aspect={project.videoAspect}
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-white/10 bg-obsidian-900">
              <p className="text-obsidian-400">Full film available on request</p>
            </div>
          )}
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_320px] lg:gap-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/5 px-4 py-2 text-xs uppercase tracking-widest2 text-accent-soft">
              {project.roleCallout}
            </span>

            <h2 className="mt-8 font-display text-2xl text-white md:text-3xl">Synopsis</h2>
            <p className="mt-4 max-w-2xl text-obsidian-300">{project.synopsis}</p>

            <h2 className="mt-10 font-display text-2xl text-white md:text-3xl">
              Production Notes
            </h2>
            <p className="mt-4 max-w-2xl text-obsidian-300">{project.description}</p>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-obsidian-400">
              {project.specs.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {project.specs.location}
                </span>
              )}
              {project.specs.duration && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {project.specs.duration}
                </span>
              )}
            </div>
          </div>

          <aside className="h-max rounded-2xl border border-white/10 bg-white/[0.015] p-8">
            <p className="mb-6 text-xs uppercase tracking-widest2 text-obsidian-400">
              Project Specs
            </p>

            <dl className="space-y-6 text-sm">
              <div>
                <dt className="text-obsidian-500">Client</dt>
                <dd className="mt-1 text-obsidian-100">{project.specs.client}</dd>
              </div>
              <div>
                <dt className="text-obsidian-500">Deliverable</dt>
                <dd className="mt-1 text-obsidian-100">{project.specs.deliverable}</dd>
              </div>
              <div>
                <dt className="text-obsidian-500">Roles</dt>
                <dd className="mt-1 text-obsidian-100">{project.roles.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-obsidian-500">Production Gear</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.specs.gear.map((g) => (
                    <span
                      key={g}
                      className="rounded-md border border-white/10 px-2 py-1 font-mono text-xs text-obsidian-300"
                    >
                      {g}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-obsidian-500">Post Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.specs.postTools.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/10 px-2 py-1 font-mono text-xs text-obsidian-300"
                    >
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        {project.gallery.length > 0 && (
          <div className="mt-24">
            <h2 className="mb-8 font-display text-2xl text-white md:text-3xl">
              BTS &amp; Stills
            </h2>
            <RevealGallery gallery={project.gallery} />
          </div>
        )}

        <div className="mt-24 border-t border-white/10 pt-10">
          <Link
            href={`/work/${nextProject.slug}`}
            data-cursor="view"
            className="group flex items-center justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-widest2 text-obsidian-500">Next Project</p>
              <h3 className="mt-3 font-display text-3xl text-white transition-colors group-hover:text-obsidian-200 md:text-5xl">
                {nextProject.title}
              </h3>
            </div>
            <ArrowRight className="h-8 w-8 shrink-0 text-obsidian-500 transition-transform duration-500 group-hover:translate-x-2 group-hover:text-white" />
          </Link>
        </div>
      </div>
    </article>
  );
}
