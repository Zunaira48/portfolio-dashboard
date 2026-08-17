"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Loader2, CheckCircle2, Plus , Trash2} from "lucide-react";

interface Setting {
  id: number;
  key: string;
  value: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setSettings(await adminApi.getSiteSettings());
      setLoading(false);
    })();
  }, []);

  async function load() {
    setLoading(true);
    setSettings(await adminApi.getSiteSettings());
    setLoading(false);
  }

  function updateLocal(key: string, value: string) {
    setSettings((s) => s.map((item) => (item.key === key ? { ...item, value } : item)));
  }

  async function saveOne(key: string, value: string) {
    setSavingKey(key);
    await adminApi.upsertSiteSetting(key, value);
    setSavingKey(null);
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 2000);
  }

  async function addNew(e: React.FormEvent) {
    e.preventDefault();
    if (!newKey.trim()) return;
    await adminApi.upsertSiteSetting(newKey.trim(), newValue);
    setNewKey("");
    setNewValue("");
    await load();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Site Settings</h1>
      <p className="text-text-muted text-sm mb-6">
        Free-form key/value settings the public site reads (e.g. NavBrandName, SiteTagline).
      </p>

      <div className="card divide-y divide-border mb-6 max-w-2xl">
        {settings.map((s) => (
          <div key={s.key} className="p-4 flex items-center gap-3">
            <span className="text-sm font-mono text-text-muted w-40 shrink-0 truncate">{s.key}</span>
            <input
              value={s.value}
              onChange={(e) => updateLocal(s.key, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
            />
            <button
              onClick={() => saveOne(s.key, s.value)}
              disabled={savingKey === s.key}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-60"
            >
              {savingKey === s.key ? "Saving..." : "Save"}
            </button>
            {savedKey === s.key ? <CheckCircle2 size={16} className="text-green-500" /> : null}
            <button
              onClick={async () => { await adminApi.deleteSiteSetting(s.key); await load(); }}
              className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors"
              aria-label={`Delete ${s.key}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {settings.length === 0 ? <p className="p-6 text-sm text-text-muted">No settings yet.</p> : null}
      </div>

      <div className="card p-5 max-w-2xl">
        <h3 className="font-display font-bold text-sm mb-3">Add New Setting</h3>
        <form onSubmit={addNew} className="flex gap-3 flex-wrap">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key, e.g. HeroBadgeText"
            className="flex-1 min-w-40 px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
          />
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            className="flex-1 min-w-40 px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
          />
          <button type="submit" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Plus size={15} /> Add
          </button>
        </form>
      </div>
    </div>
  );
}