"use client";

import { useState } from "react";
import { api, type Profile, type SocialLink } from "@/lib/api";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import {
  GithubIcon,
  LinkedinIcon,
  WhatsappIcon,
  InstagramIcon,
} from "@/components/icons";
import {
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
  instagram: InstagramIcon,
};

function ConnectRow({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon: React.ComponentType<{ size?: number }>;
}) {
  const content = (
    <div className="card p-4 flex items-center gap-3 hover:border-accent transition-colors">
      <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-text-muted">
          {label}
        </p>

        <p className="text-sm font-semibold truncate">
          {value}
        </p>
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {content}
    </a>
  );
}

function ConnectPanel({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-display font-bold mb-1">
        Connect With Me
      </h3>

      <ConnectRow
        label="Email"
        value={profile.contactEmail}
        href={`mailto:${profile.contactEmail}`}
        icon={Mail}
      />

      {socialLinks.map((link) => {
        const iconKey =
          link.iconKey?.toLowerCase() ?? link.platform.toLowerCase();

        const Icon = ICONS[iconKey] ?? GithubIcon;

        return (
          <ConnectRow
            key={link.platform}
            label={link.platform}
            value={link.url}
            href={link.url}
            icon={Icon}
          />
        );
      })}
    </div>
  );
}

export default function ContactSection({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setErrorMsg("Please fill in your name, email, and message.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      await api.submitContact(form);

      setStatus("success");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      setStatus("error");
      setErrorMsg(
        "Something went wrong sending your message. Please try again."
      );
    }
  }

  return (
    <section id="contact" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Let's work together"
            description="Have a project in mind? Let's talk."
          />
        </Reveal>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8">
          <Reveal delay={80}>
            <form
              onSubmit={handleSubmit}
              className="card p-6 md:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1.5"
                >
                  Subject{" "}
                  <span className="text-text-muted font-normal">
                    (optional)
                  </span>
                </label>

                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1.5"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Mail size={16} />
                )}

                {status === "loading" ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && (
                <p className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle2 size={16} />
                  Thanks for reaching out — I&apos;ll get back to you soon.
                </p>
              )}

              {status === "error" && (
                <p className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle size={16} />
                  {errorMsg}
                </p>
              )}
            </form>
          </Reveal>

          <Reveal delay={140}>
            <ConnectPanel
              profile={profile}
              socialLinks={socialLinks}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}