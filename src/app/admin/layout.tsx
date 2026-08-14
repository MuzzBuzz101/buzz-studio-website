import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-obsidian-950 text-obsidian-50">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_55%_at_12%_-10%,rgba(212,175,55,0.16),transparent_55%),radial-gradient(ellipse_60%_45%_at_95%_15%,rgba(255,255,255,0.05),transparent_50%),radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(212,175,55,0.06),transparent_55%),linear-gradient(180deg,rgba(10,10,10,0.2),rgba(5,5,5,0.85))]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="film-grain pointer-events-none fixed inset-0 opacity-90"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
