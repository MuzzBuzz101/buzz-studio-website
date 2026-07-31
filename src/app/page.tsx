import { Hero } from "@/components/sections/hero";
import { SelectedWorks } from "@/components/sections/selected-works";
import { MotionStillsSection } from "@/components/sections/motion-stills-section";
import { PipelineSection } from "@/components/sections/pipeline-section";
import { ClientsTicker } from "@/components/sections/clients-ticker";
import { ContactSection } from "@/components/sections/contact-section";
import { getFeaturedProjects, projects } from "@/data/projects";

export default function Home() {
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      <Hero />
      <SelectedWorks projects={featuredProjects} />
      <MotionStillsSection projects={projects} />
      <PipelineSection />
      <ClientsTicker />
      <ContactSection />
    </>
  );
}
