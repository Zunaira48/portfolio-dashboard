"use client";

import { useEffect } from "react";
import type { Project } from "@/lib/api";
import { X, ExternalLink } from "lucide-react";
import { GithubIcon } from "./icons";

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="card max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-4 right-4 p-2 rounded-full border border-border hover:border-accent transition-colors"
        >
          <X size={18} />
        </button>

        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={project.imageAlt ?? project.title}
            className="w-full h-48 object-cover rounded-xl mb-5 -mt-1"
          />
        ) : null}

        <span className="badge mb-4 inline-block">{project.category}</span>
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 pr-10">{project.title}</h3>

        <p className="text-text-muted leading-relaxed mb-6 whitespace-pre-line">{project.fullDescription}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech) => (
            <span key={tech} className="badge">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.gitHubUrl ? (
            <a
              href={project.gitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <GithubIcon size={16} /> View Code
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ExternalLink size={16} /> Live Demo
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
