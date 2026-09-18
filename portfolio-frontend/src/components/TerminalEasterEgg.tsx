"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TerminalSquare, X } from "lucide-react";
import { api } from "@/lib/api";

interface Line {
  type: "input" | "output";
  text: string;
}

const HELP_TEXT = [
  "Available commands:",
  "  whoami                 show who this portfolio belongs to",
  "  skills --list          list skill categories",
  "  projects --featured    list featured projects",
  "  sudo hire-me           you know what to do",
  "  clear                  clear the terminal",
  "  exit                   close this terminal",
];

export default function TerminalEasterEgg() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "Portfolio Terminal v1.0 — type 'help' to get started." },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  async function runCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    setLines((prev) => [...prev, { type: "input", text: cmd }]);
    const lower = cmd.toLowerCase();

    if (lower === "help") {
      setLines((prev) => [...prev, ...HELP_TEXT.map((t) => ({ type: "output" as const, text: t }))]);
    } else if (lower === "clear") {
      setLines([]);
    } else if (lower === "exit") {
      setOpen(false);
    } else if (lower === "whoami") {
      try {
        const profile = await api.getProfile();
        setLines((prev) => [
          ...prev,
          { type: "output", text: `${profile.fullName} — ${profile.titles.join(" / ")}` },
          { type: "output", text: profile.availabilityStatus },
        ]);
      } catch {
        setLines((prev) => [...prev, { type: "output", text: "Couldn't reach the server. Try again in a moment." }]);
      }
    } else if (lower === "skills --list" || lower === "skills") {
      try {
        const categories = await api.getSkills();
        setLines((prev) => [...prev, ...categories.map((c) => ({ type: "output" as const, text: `- ${c.name}` }))]);
      } catch {
        setLines((prev) => [...prev, { type: "output", text: "Couldn't reach the server. Try again in a moment." }]);
      }
    } else if (lower === "projects --featured" || lower === "projects") {
      try {
        const projects = await api.getProjects();
        const featured = projects.filter((p) => p.featured);
        const list = featured.length > 0 ? featured : projects;
        setLines((prev) => [...prev, ...list.map((p) => ({ type: "output" as const, text: `- ${p.title}` }))]);
      } catch {
        setLines((prev) => [...prev, { type: "output", text: "Couldn't reach the server. Try again in a moment." }]);
      }
    } else if (lower === "sudo hire-me") {
      setLines((prev) => [...prev, { type: "output", text: "Permission granted. Redirecting to Contact..." }]);
      setTimeout(() => {
        setOpen(false);
        router.push("/contact");
      }, 1200);
    } else {
      setLines((prev) => [...prev, { type: "output", text: `Command not found: ${cmd}. Type 'help' for a list.` }]);
    }
  }

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-xl h-104 bg-[#0a0a0f] border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden font-mono text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-soft">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-text-muted text-xs">portfolio@zunaira: ~</span>
              <button onClick={() => setOpen(false)} aria-label="Close terminal" className="text-text-muted hover:text-text">
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 text-[#c9c9d9] arch-scroll">
              {lines.map((line, i) => (
                <div key={i}>
                  {line.type === "input" ? (
                    <span>
                      <span className="text-green-400">$ </span>
                      {line.text}
                    </span>
                  ) : (
                    <span className="text-[#c9c9d9]">{line.text}</span>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runCommand(input);
                setInput("");
              }}
              className="flex items-center gap-2 px-4 py-2.5 border-t border-border"
            >
              <span className="text-green-400">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#c9c9d9]"
                autoComplete="off"
                spellCheck={false}
              />
            </form>
          </div>
        </div>
      ) : null}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open terminal easter egg"
          title="Press / to open"
          className="fixed bottom-6 left-6 z-40 p-3 rounded-full border border-border bg-bg-soft text-text-muted hover:text-accent hover:border-accent transition-colors"
        >
          <TerminalSquare size={18} />
        </button>
      ) : null}
    </>
  );
}