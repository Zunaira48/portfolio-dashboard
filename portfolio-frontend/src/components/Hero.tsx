"use client";

import { useEffect, useState } from "react";
import type { Profile, SocialLink } from "@/lib/api";
import { ArrowRight, Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
};

function SocialLinkItem({ link, Icon }: { link: SocialLink; Icon: React.ComponentType<{ size?: number }> }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.platform}
      className="p-2.5 rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
    >
      <Icon size={18} />
    </a>
  );
}

export default function Hero({ profile, socialLinks }: { profile: Profile; socialLinks: SocialLink[] }) {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (profile.titles.length <= 1) return;
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % profile.titles.length), 2800);
    return () => clearInterval(id);
  }, [profile.titles.length]);

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "var(--color-accent)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        <div>
          <span className="badge mb-6 inline-block">{profile.availabilityStatus}</span>

          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
            {profile.fullName}
          </h1>

          <p className="text-xl md:text-2xl font-medium mb-6" style={{ color: "var(--color-accent)" }}>
            {profile.titles[roleIndex]}
          </p>

          <p className="text-text-muted text-lg max-w-xl mb-8 leading-relaxed">
            {profile.heroDescription}
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <a href="#projects" className="btn-primary inline-flex items-center gap-2">
              View Projects <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn-secondary inline-flex items-center gap-2">
              Contact Me <Mail size={16} />
            </a>
            {profile.resumeUrl ? (
              <a
                href={profile.resumeUrl}
                download
                className="btn-secondary inline-flex items-center gap-2"
              >
                Download CV <Download size={16} />
              </a>
            ) : null}
          </div>

          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <SocialLinkItem
                key={link.platform}
                link={link}
                Icon={ICONS[link.iconKey ?? link.platform.toLowerCase()] ?? GithubIcon}
              />
            ))}
          </div>
        </div>

        <div className="justify-self-center">
          <div
            className="w-56 h-56 md:w-72 md:h-72 rounded-3xl overflow-hidden border border-border"
            style={{ background: "var(--color-surface)" }}
          >
            {profile.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.profileImageUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl font-display font-bold text-text-muted">
                {profile.fullName.split(" ").map((n) => n[0]).join("")}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
