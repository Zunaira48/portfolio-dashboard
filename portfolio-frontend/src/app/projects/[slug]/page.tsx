import { api } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { GithubIcon } from "@/components/icons";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectHeroMedia from "@/components/ProjectHeroMedia";
import ProjectGallery from "@/components/ProjectGallery";
import { isVideoUrl } from "@/lib/media";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [settings, profile, socialLinks] = await Promise.all([
    api.getSiteSettings(),
    api.getProfile(),
    api.getSocialLinks(),
  ]);

  let project;
  try {
    project = await api.getProjectBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <Nav brandName={settings.NavBrandName ?? profile.fullName} />
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <ProjectHeroMedia url={project.galleryUrls.find((u) => isVideoUrl(u)) || project.imageUrl} />
        <span className="badge mb-4 inline-block">{project.category}</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-6 text-pretty">{project.title}</h1>

                <div
          className="rich-content text-text-muted text-lg leading-relaxed text-justify mb-8"
          dangerouslySetInnerHTML={{ __html: project.fullDescription }}
        />

        <ProjectGallery urls={project.galleryUrls.filter((u) => !isVideoUrl(u))} />

        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
          {project.gitHubUrl ? (
            <a href={project.gitHubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
              <GithubIcon size={16} /> View Code
            </a>
          ) : null}
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
              <ExternalLink size={16} /> Live Demo
            </a>
          ) : null}
        </div>
      </main>
      <Footer socialLinks={socialLinks} brandName={settings.NavBrandName ?? profile.fullName} profile={profile} />
    </>
  );
}