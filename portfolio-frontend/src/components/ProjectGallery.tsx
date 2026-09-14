"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectGallery({ urls }: { urls: string[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (urls.length === 0) return null;

  function close() {
    setOpenIndex(null);
  }
  function prev() {
    setOpenIndex((i) => (i === null ? null : (i - 1 + urls.length) % urls.length));
  }
  function next() {
    setOpenIndex((i) => (i === null ? null : (i + 1) % urls.length));
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {urls.map((url, i) => (
          <button
            key={url}
            onClick={() => setOpenIndex(i)}
            className="relative aspect-video rounded-xl overflow-hidden border border-border card group transition-transform duration-200 hover:-translate-y-0.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={close}>
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full border border-white/30 text-white hover:border-white transition-colors"
          >
            <X size={18} />
          </button>

          {urls.length > 1 ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-white/30 text-white hover:border-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-white/30 text-white hover:border-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          ) : null}

          <div key={openIndex} className="max-w-5xl max-h-[85vh] w-full animate-[fadeIn_0.25s_ease]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={urls[openIndex]} alt="" className="w-full max-h-[85vh] object-contain rounded-xl mx-auto" />
          </div>
        </div>
      ) : null}
    </>
  );
}