import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";
import { AiConcierge } from "@/components/concierge/ai-concierge";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.fullName} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.fullName}`,
  },
  description: siteConfig.description,
  keywords: [
    "creative producer",
    "cinematographer",
    "video editor",
    "commercial photographer",
    "music video director",
    "colorist",
    "content creator Cyprus",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.fullName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.fullName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.fullName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <noscript>
          {/* Scroll reveals start hidden; without JS they must not stay hidden. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body
        className={cn(
          fontSans.variable,
          fontDisplay.variable,
          fontMono.variable,
          "cursor-none-desktop bg-obsidian-950 font-sans text-obsidian-50 antialiased"
        )}
      >
        <SmoothScrollProvider>
          <CustomCursor />
          <Header />
          <main>{children}</main>
          <Footer />
          <AiConcierge />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
