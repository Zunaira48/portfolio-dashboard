"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/api";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ProjectModal from "./ProjectModal";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./icons";

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <div className="card overflow-hidden flex flex-col hover:border-accent transition-colors group">
      {project.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.imageUrl}
          alt={project.imageAlt ?? project.title}
          className="w-full h-44 object-cover"
        />
      ) : null}

      <div className="p-6 flex flex-col flex-1">
      <div className="flex items-start justify-between mb-4">
        <span className="badge">{project.category}</span>
        {project.featured ? <span className="text-xs font-semibold text-accent">Featured</span> : null}
      </div>

      <h3 className="font-display text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">{project.shortDescription}</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.technologies.slice(0, 4).map((tech) => (
          <span key={tech} className="text-xs px-2 py-1 rounded-full bg-accent-soft text-accent font-medium">
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={onOpen}
          className="text-sm font-semibold text-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all"
        >
          Details <ArrowUpRight size={15} />
        </button>
        <div className="flex gap-3">
          {project.gitHubUrl ? (
            <a href={project.gitHubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`}>
              <GithubIcon size={17} />
              <style>{`.github-icon { color: var(--text-muted); } .github-icon:hover { color: var(--accent); transition: colors 0.2s; }`}</style>
            </a>
          ) : null}
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live demo`}>
              <ExternalLink size={17} className="text-text-muted hover:text-accent transition-colors" />
            </a>
          ) : null}
        </div>
      </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All");
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-12 md:py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Projects" title="Things I've built" />
        </Reveal>

        {categories.length > 2 ? (
          <Reveal delay={80}>
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={
                    cat === filter
                      ? "px-4 py-2 rounded-full text-sm font-semibold bg-accent text-white transition-colors"
                      : "px-4 py-2 rounded-full text-sm font-semibold border border-border text-text-muted hover:text-text hover:border-accent transition-colors"
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        ) : null}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <Reveal key={project.id} delay={i * 60}>
              <ProjectCard project={project} onOpen={() => setOpenProject(project)} />
            </Reveal>
          ))}
        </div>
      </div>

      {openProject ? <ProjectModal project={openProject} onClose={() => setOpenProject(null)} /> : null}
    </section>
  );
}
