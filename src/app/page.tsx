import { Hero } from "@/components/sections/hero";
import { SelectedWorks } from "@/components/sections/selected-works";
import { MotionStillsSection } from "@/components/sections/motion-stills-section";
import { PipelineSection } from "@/components/sections/pipeline-section";
import { ClientsTicker } from "@/components/sections/clients-ticker";
import { ContactSection } from "@/components/sections/contact-section";
import { getFeaturedProjects, projects } from "@/data/projects";
import { heroVideos, heroImages } from "@/data/site";

export default function Home() {
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      <Hero videos={heroVideos} images={heroImages} />
      <SelectedWorks projects={featuredProjects} />
      <MotionStillsSection projects={projects} />
      <PipelineSection />
      <ClientsTicker />
      <ContactSection />
    </>
  );
}
