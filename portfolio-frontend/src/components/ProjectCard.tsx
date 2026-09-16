"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Project } from "@/lib/api";
import { GithubIcon } from "@/components/icons";
import { ExternalLink, ArrowUpRight } from "lucide-react";

function isVideoUrl(url: string) {
  return /\.(mp4|webm)(\?|$)/i.test(url);
}

export default function ProjectCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewUrl = project.galleryUrls?.[0] || project.imageUrl;
  const previewIsVideo = previewUrl ? isVideoUrl(previewUrl) : false;

  function handleEnter() {
    videoRef.current?.play();
  }
  function handleLeave() {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="card project-card-hover overflow-hidden flex flex-col h-full group"
    >
      {previewUrl ? (
        previewIsVideo ? (
          <video
            ref={videoRef}
            src={previewUrl}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noremoteplayback nofullscreen"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-40 sm:h-44 object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={project.imageAlt ?? project.title} className="w-full h-40 sm:h-44 object-cover" />
        )
      ) : null}

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3 gap-2">
          <span className="badge">{project.category}</span>
          {project.featured ? <span className="text-xs font-semibold text-accent shrink-0">Featured</span> : null}
        </div>

        <h3 className="font-display text-lg sm:text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">{project.shortDescription}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-sm font-semibold text-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Details <ArrowUpRight size={15} />
          </span>
          <div className="flex gap-3">
            {project.gitHubUrl ? <GithubIcon size={17} /> : null}
            {project.liveUrl ? <ExternalLink size={17} className="text-text-muted" /> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}