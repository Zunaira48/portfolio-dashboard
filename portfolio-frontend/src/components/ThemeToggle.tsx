"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // Always start matching the server's hardcoded data-theme="dark" in layout.tsx,
  // so the first client render matches the server HTML exactly (no hydration mismatch).
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // After mount (client-only), read the real saved preference and apply it.
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved && saved !== "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(saved);
    }
  }, []);

  // Sync the DOM attribute whenever theme changes.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="p-2 rounded-full border border-border hover:border-accent transition-colors"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}