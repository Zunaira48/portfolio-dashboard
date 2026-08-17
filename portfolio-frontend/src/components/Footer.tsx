"use client";

import type { Profile, SocialLink } from "@/lib/api";
import { MessageCircle, Camera, Mail } from "lucide-react";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-1.026-.013-1.862-2.782.604-3.369-1.18-3.369-1.18-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.337-2.221-.253-4.556-1.111-4.556-4.944 0-1.092.39-1.985 1.029-2.685-.103-.253-.446-1.271.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.775a9.57 9.57 0 0 1 2.504.337c1.909-1.295 2.748-1.026 2.748-1.026.546 1.379.203 2.397.1 2.65.64.7 1.028 1.593 1.028 2.685 0 3.842-2.339 4.688-4.566 4.936.359.309.678.916.678 1.846 0 1.334-.012 2.409-.012 2.738 0 .267.18.578.688.48A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1 4.98 2.12 4.98 3.5ZM.3 8.08h4.4V23H.3V8.08ZM7.43 8.08h4.22v2.04h.06c.59-1.12 2.03-2.3 4.18-2.3 4.47 0 5.3 2.94 5.3 6.77V23h-4.4v-7.38c0-1.76-.03-4.03-2.46-4.03-2.47 0-2.85 1.93-2.85 3.9V23h-4.4V8.08Z" />
    </svg>
  );
}

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  whatsapp: MessageCircle,
  instagram: Camera,
};

const QUICK_LINKS = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block text-sm text-text-muted hover:text-text transition-colors"
    >
      {label}
    </a>
  );
}

function SocialIconLink({ link }: { link: SocialLink }) {
  const iconKey =
    link.iconKey?.toLowerCase() ?? link.platform.toLowerCase();

  const Icon = ICONS[iconKey] ?? GithubIcon;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.platform}
      className="p-2.5 rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
    >
      <Icon size={16} />
    </a>
  );
}

export default function Footer({
  socialLinks,
  brandName = "Portfolio",
  profile,
}: {
  socialLinks: SocialLink[];
  brandName?: string;
  profile: Profile;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
        <div>
          <a
            href="#top"
            className="font-display font-bold text-lg tracking-tight block mb-3"
          >
            {brandName}
          </a>

          <p className="text-sm text-text-muted mb-4 max-w-xs">
            {profile.heroDescription}
          </p>

          <span className="badge">{profile.location}</span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-accent font-semibold mb-4">
            Quick Links
          </p>

          <div className="space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <QuickLink
                key={link.href}
                href={link.href}
                label={link.label}
              />
            ))}
          </div>
        </div>

        <div className="card p-5">
          <p className="text-xs uppercase tracking-wide text-accent font-semibold mb-3">
            Connect
          </p>

          <a
  href={
    profile.contactEmail
      ? `mailto:${profile.contactEmail}`
      : "#"
  }
  className="btn-primary w-full inline-flex items-center justify-center gap-2 mb-4 text-sm"
  aria-label={`Send email to ${profile.contactEmail}`}
>
  <Mail size={15} />
  Email Me
</a>

          <div className="flex gap-2 flex-wrap">
            {socialLinks.map((link) => (
              <SocialIconLink key={link.platform} link={link} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p>
            © {year} {profile.fullName}. All rights reserved.
          </p>

          <p>{profile.availabilityStatus}</p>
        </div>
      </div>
    </footer>
  );
}