import { clientLogos, highlights } from "@/data/pipeline";

export function ClientsTicker() {
  const loopedLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="relative overflow-hidden border-t border-white/10 py-16">
      <p className="container mb-10 text-center text-xs uppercase tracking-widest2 text-obsidian-500">
        Trusted by restaurants, real estate firms, artists &amp; agencies
      </p>

      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max shrink-0 animate-marquee items-center gap-16 pr-16">
          {loopedLogos.map((logo, i) => (
            <span
              key={`${logo.id}-${i}`}
              className="whitespace-nowrap font-display text-xl text-obsidian-500 transition-colors hover:text-obsidian-200"
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>

      <div className="container mt-16 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((highlight) => (
          <div key={highlight.id} className="text-center sm:text-left">
            <p className="font-display text-lg text-white">{highlight.title}</p>
            <p className="mt-1 text-xs uppercase tracking-widest2 text-obsidian-500">
              {highlight.organization} · {highlight.year}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
