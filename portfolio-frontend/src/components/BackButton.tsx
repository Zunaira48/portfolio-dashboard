"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ fallbackHref, label }: { fallbackHref: string; label: string }) {
  const router = useRouter();

  function handleClick() {
    // If there's real browsing history in this tab, go back to wherever the
    // person actually came from (Home, Projects list, a search engine result,
    // etc). Only fall back to a fixed page if this is the very first page
    // they've loaded in this tab (e.g. opened via a direct shared link).
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text mb-8 transition-colors"
    >
      <ArrowLeft size={16} /> {label}
    </button>
  );
}