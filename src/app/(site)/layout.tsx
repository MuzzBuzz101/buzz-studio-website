import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AiConcierge } from "@/components/concierge/ai-concierge";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnalyticsTracker />
      <Header />
      <main>{children}</main>
      <Footer />
      <AiConcierge />
    </>
  );
}
