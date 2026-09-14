"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import UrlListInput from "./UrlListInput";

export type FieldType = "text" | "textarea" | "checkbox" | "number" | "tags" | "lines" | "richtext" | "urlList";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  helpText?: string;
}

export type FormValues = Record<string, string | number | boolean | string[]>;

  function TagsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [text, setText] = useState(value.join(", "));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setText(raw);
    onChange(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  return (
    <input
      type="text"
      placeholder="Comma separated, e.g. React, TypeScript, CSS"
      value={text}
      onChange={handleChange}
      className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none transition-colors text-sm"
    />
  );
}
export default function AdminFormModal({
  title,
  fields,
  initialValues,
  onSubmit,
  onClose,
}: {
  title: string;
  fields: FieldConfig[];
  initialValues: FormValues;
  onSubmit: (values: FormValues) => Promise<void>;
  onClose: () => void;
}) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  

  function update(name: string, value: string | number | boolean | string[]) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Strip out any blank boxes left over from clicking "Add another" without
      // filling it in, for every urlList-type field on this form.
      const cleaned: FormValues = { ...values };
      for (const field of fields) {
        if (field.type === "urlList" && Array.isArray(cleaned[field.name])) {
          cleaned[field.name] = (cleaned[field.name] as string[]).filter((u) => u.trim().length > 0);
        }
      }
      await onSubmit(cleaned);
      onClose();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Failed to save. Check the fields and try again.");
      setSaving(false);
    }
  }


  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="card max-w-[min(36rem,calc(100vw-1.5rem))] w-full max-h-[85vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-full border border-border hover:border-accent transition-colors"
        >
          <X size={16} />
        </button>

        <h3 className="font-display text-lg font-bold mb-5 pr-8">{title}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => {
            const currentLength = typeof values[field.name] === "string" ? (values[field.name] as string).length : null;
            return (
              <div key={field.name}>
                {field.type !== "checkbox" ? (
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium">
                      {field.label} {field.required ? <span className="text-accent">*</span> : null}
                    </label>
                    {(field.type === "text" || field.type === "textarea") && currentLength !== null ? (
                      <span className="text-xs text-text-muted">{currentLength} chars</span>
                    ) : null}
                  </div>
                ) : null}

                {field.type === "text" || field.type === "number" ? (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={String(values[field.name] ?? "")}
                    onChange={(e) => update(field.name, field.type === "number" ? Number(e.target.value) : e.target.value)}
                    required={field.required}
                    className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none transition-colors text-sm"
                  />
                ) : null}

                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={String(values[field.name] ?? "")}
                    onChange={(e) => update(field.name, e.target.value)}
                    required={field.required}
                    className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none transition-colors text-sm resize-none"
                  />
                ) : null}

                {field.type === "tags" ? (
                 <TagsInput
                value={Array.isArray(values[field.name]) ? (values[field.name] as string[]) : []}
                onChange={(tags) => update(field.name, tags)}
                 />
                ) : null}
                                {field.type === "richtext" ? (
                  <RichTextEditor
                    value={String(values[field.name] ?? "")}
                    onChange={(html) => update(field.name, html)}
                  />
                ) : null}

                {field.type === "lines" ? (
                  <textarea
                    rows={4}
                    placeholder="One item per line"
                    value={Array.isArray(values[field.name]) ? (values[field.name] as string[]).join("\n") : ""}
                    onChange={(e) => update(field.name, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
                    className="w-full px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none transition-colors text-sm resize-none"
                  />
                ) : null}

                {field.type === "checkbox" ? (
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(values[field.name])}
                      onChange={(e) => update(field.name, e.target.checked)}
                      className="w-4 h-4 accent-(--color-accent)"
                    />
                    {field.label}
                  </label>
                ) : null}


                {field.type === "urlList" ? (
                  <UrlListInput
                    value={Array.isArray(values[field.name]) ? (values[field.name] as string[]) : []}
                    onChange={(urls) => update(field.name, urls)}
                  />
                ) : null}

                {field.helpText ? <p className="text-xs text-text-muted mt-1">{field.helpText}</p> : null}
              </div>
            );
          })}

          {error ? <p className="text-red-500 text-sm px-3 py-2 rounded-lg bg-red-500/10">{error}</p> : null}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
