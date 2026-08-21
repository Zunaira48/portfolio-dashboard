"use client";

import { useEffect, useState } from "react";
import { api, type Profile, type SocialLink } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { Loader2 } from "lucide-react";

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
        <ContactSection profile={profile} socialLinks={socialLinks} />
      </main>
      <Footer socialLinks={socialLinks} brandName={settings.NavBrandName ?? profile.fullName} profile={profile} />
    </>
  );
}