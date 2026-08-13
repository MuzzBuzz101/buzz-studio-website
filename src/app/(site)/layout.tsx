import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AiConcierge } from "@/components/concierge/ai-concierge";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <AiConcierge />
    </>
  );
}
