import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Featured } from "@/components/featured";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { SkillsTicker } from "@/components/skills-ticker";
import { Story } from "@/components/story";

export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <Projects />
      <SkillsTicker />
      <Experience />
      <Story />
      <Contact />
    </>
  );
}
