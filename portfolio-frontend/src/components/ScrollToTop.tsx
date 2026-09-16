"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full text-white transition-all hover:scale-110"
      style={{
        background: "var(--color-accent)",
        boxShadow: "0 8px 24px color-mix(in srgb, var(--color-accent) 55%, transparent)",
      }}
    >
      <ArrowUp size={20} />
    </button>
  );
}