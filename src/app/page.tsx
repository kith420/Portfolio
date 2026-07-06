import Nav from "@/components/Nav";
import Hero from "@/sections/Hero/Hero";
import Experience from "@/sections/Experience/Experience";
import Competitions from "@/sections/Competitions/Competitions";
import Work from "@/sections/Work/Work";
import Skills from "@/sections/Skills/Skills";
import Contact from "@/sections/Contact/Contact";
import CompetitionsToWork from "@/sections/Seam/CompetitionsToWork";

export default function Page() {
  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="content">
        <Hero />
        <Experience />
        <Competitions />
        <Work />
        <Skills />
        <Contact />
      </main>
      {/* Scroll-scrubbed overlay stitching the cork board into the Work grid. */}
      <CompetitionsToWork />
    </>
  );
}
