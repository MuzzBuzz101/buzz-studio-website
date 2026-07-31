import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-widest2 text-obsidian-500">404</p>
      <h1 className="mt-6 font-display text-fluid-lg text-white">Project not found.</h1>
      <p className="mt-4 max-w-md text-obsidian-400">
        The project you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <Link
        href="/#work"
        data-cursor="hover"
        className="mt-8 rounded-full border border-white/25 px-6 py-3 text-sm uppercase tracking-widest2 text-white transition-colors hover:border-white/60"
      >
        Back to Selected Works
      </Link>
    </div>
  );
}
