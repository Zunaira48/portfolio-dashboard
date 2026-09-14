"use client";

import { Plus, Trash2 } from "lucide-react";

export default function UrlListInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const urls = value.length > 0 ? value : [""];

  function updateAt(i: number, v: string) {
    const next = [...urls];
    next[i] = v;
    onChange(next);
  }

  function removeAt(i: number) {
    const next = urls.filter((_, idx) => idx !== i);
    onChange(next.length > 0 ? next : [""]);
  }

  return (
    <div className="space-y-2">
      {urls.map((url, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={url}
            placeholder={`Image URL ${i + 1}`}
            onChange={(e) => updateAt(i, e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
          />
          <button
            type="button"
            onClick={() => removeAt(i)}
            aria-label="Remove"
            className="p-2 rounded-md text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors shrink-0"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...urls, ""])}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent"
      >
        <Plus size={14} /> Add another
      </button>
    </div>
  );
}