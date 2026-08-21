import Link from "next/link";
import type { Project } from "@/lib/api";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import { ArrowRight } from "lucide-react";

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const featured = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 2);

  return (
    <section id="projects" className="py-12 md:py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Projects" title="Things I've built" />
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {featured.map((project, i) => (
            <Reveal key={project.id} delay={i * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <Link
            href="/projects"
            className="group relative w-full overflow-hidden rounded-2xl border border-border bg-linear-to-r from-accent-soft via-bg-soft to-accent-soft px-8 py-5 flex items-center justify-between hover:border-accent transition-colors"
          >
            <span className="font-display text-lg font-bold">View All Projects</span>
            <span className="flex items-center gap-2 text-accent font-semibold">
              Explore
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}