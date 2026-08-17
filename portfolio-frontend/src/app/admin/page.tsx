"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/adminApi";
import { FolderKanban, Briefcase, GraduationCap, Award, Mail, Sparkles } from "lucide-react";

interface Counts {
  projects: number;
  experience: number;
  education: number;
  certifications: number;
  skills: number;
  unreadMessages: number;
}

const CARDS = [
  { key: "projects", label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { key: "skills", label: "Skill Categories", href: "/admin/skills", icon: Sparkles },
  { key: "experience", label: "Experience Entries", href: "/admin/experience", icon: Briefcase },
  { key: "education", label: "Education Entries", href: "/admin/education", icon: GraduationCap },
  { key: "certifications", label: "Certifications", href: "/admin/certifications", icon: Award },
  { key: "unreadMessages", label: "Unread Messages", href: "/admin/messages", icon: Mail },
] as const;

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    (async () => {
      const [projects, skills, experience, education, certifications, unread] = await Promise.all([
        adminApi.getProjects(),
        adminApi.getSkillCategories(),
        adminApi.getExperience(),
        adminApi.getEducation(),
        adminApi.getCertifications(),
        adminApi.getContactMessages(undefined, true),
      ]);
      setCounts({
        projects: projects.length,
        skills: skills.length,
        experience: experience.length,
        education: education.length,
        certifications: certifications.length,
        unreadMessages: unread.length,
      });
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-text-muted text-sm mb-8">Overview of your portfolio content.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card) => {
          const Icon = card.icon;
          const value = counts ? counts[card.key] : null;
          return (
            <Link key={card.key} href={card.href} className="card p-5 hover:border-accent transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
                  <Icon size={18} className="text-accent" />
                </div>
                <span className="text-2xl font-bold font-display">{value ?? "…"}</span>
              </div>
              <p className="text-sm text-text-muted">{card.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}