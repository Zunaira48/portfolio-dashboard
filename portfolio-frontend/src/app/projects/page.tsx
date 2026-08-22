"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type Project, type Profile, type SocialLink } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    Promise.all([api.getProjects(), api.getProfile(), api.getSocialLinks(), api.getSiteSettings()]).then(
      ([p, prof, links, s]) => {
        setProjects(p);
        setProfile(prof);
        setSocialLinks(links);
        setSettings(s);
        setLoading(false);
      }
    );
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      <Nav brandName={settings.NavBrandName ?? profile.fullName}
       />
      <main className="max-w-6xl mx-auto px-6 py-10 md:py-14 min-h-[60vh]">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <Reveal>
          <SectionHeading eyebrow="Projects" title="Everything I've built" />
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
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 ? <p className="text-text-muted text-sm">No projects in this category yet.</p> : null}
      </main>
      <Footer socialLinks={socialLinks} brandName={settings.NavBrandName ?? profile.fullName} profile={profile} />
    </>
  );
}