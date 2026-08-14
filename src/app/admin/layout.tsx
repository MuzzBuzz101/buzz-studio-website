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
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.08),_transparent_45%),radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.04),_transparent_50%),radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02),_transparent_60%)]"
      />
      <div aria-hidden className="film-grain pointer-events-none fixed inset-0 opacity-80" />
      <div className="relative">{children}</div>
    </div>
  );
}
