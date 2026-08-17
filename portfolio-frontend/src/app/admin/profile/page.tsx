"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminProfile } from "@/lib/adminApi";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [titlesInput, setTitlesInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.getProfile().then((p) => {
      setProfile(p);
      setTitlesInput(p.titles.join(", "));
      setLoading(false);
    });
  }, []);

  function update<K extends keyof AdminProfile>(key: K, value: AdminProfile[K]) {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await adminApi.updateProfile({
        ...profile,
        titles: titlesInput.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !profile) {
    return (
      <div className="flex items-center gap-2 text-text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Profile</h1>
      <p className="text-text-muted text-sm mb-6">This information drives your Hero and About sections.</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1.5">Full Name</label>
          <input
            value={profile.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Titles</label>
          <input
            value={titlesInput}
            onChange={(e) => setTitlesInput(e.target.value)}
            placeholder="Comma separated, e.g. Software Engineer, QA Engineer"
            className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
          />
          <p className="text-xs text-text-muted mt-1">These rotate in the Hero section.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Hero Description</label>
          <textarea
            rows={3}
            value={profile.heroDescription}
            onChange={(e) => update("heroDescription", e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">About Description</label>
          <textarea
            rows={5}
            value={profile.aboutDescription}
            onChange={(e) => update("aboutDescription", e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Location</label>
            <input
              value={profile.location}
              onChange={(e) => update("location", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Availability Status</label>
            <input
              value={profile.availabilityStatus}
              onChange={(e) => update("availabilityStatus", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Contact Email</label>
          <input
            type="email"
            value={profile.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Profile Image URL</label>
          <input
            value={profile.profileImageUrl ?? ""}
            onChange={(e) => update("profileImageUrl", e.target.value)}
            placeholder="Paste a Cloudinary URL from the Media page"
            className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Resume/CV URL</label>
          <input
            value={profile.resumeUrl ?? ""}
            onChange={(e) => update("resumeUrl", e.target.value)}
            placeholder="Link to your hosted resume PDF"
            className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
          />
        </div>

        {error ? <p className="text-red-500 text-sm px-3 py-2 rounded-lg bg-red-500/10">{error}</p> : null}

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved ? (
            <span className="flex items-center gap-1.5 text-sm text-green-500">
              <CheckCircle2 size={16} /> Saved
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}