"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Profile, type SocialLink } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProfile(), api.getSocialLinks(), api.getSiteSettings()]).then(([p, links, s]) => {
      setProfile(p);
      setSocialLinks(links);
      setSettings(s);
      setLoading(false);
    });
  }, []);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      <Nav brandName={settings.NavBrandName ?? profile.fullName} />
      <main className="min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-6 pt-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
        <ContactSection profile={profile} socialLinks={socialLinks} />
      </main>
      <Footer socialLinks={socialLinks} brandName={settings.NavBrandName ?? profile.fullName} profile={profile} />
    </>
  );
}