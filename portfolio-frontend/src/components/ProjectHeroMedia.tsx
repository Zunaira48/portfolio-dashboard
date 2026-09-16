"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { isVideoUrl } from "@/lib/media";

export default function ProjectHeroMedia({ url }: { url: string | null }) {
  const [open, setOpen] = useState(false);
  if (!url) return null;

  const isVideo = isVideoUrl(url);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full rounded-2xl overflow-hidden border border-border mb-8 block group transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_color-mix(in_srgb,var(--color-accent)_55%,transparent)] cursor-zoom-in bg-bg-soft"
      >
        {isVideo ? (
          <video
            src={url}
            muted
            loop
            autoPlay
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noremoteplayback nofullscreen"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full max-h-130 object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="w-full max-h-130 object-contain" />
        )}
      </button>

      {open ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full border border-white/30 text-white hover:border-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="max-w-5xl max-h-[85vh] w-full animate-[fadeIn_0.25s_ease]" onClick={(e) => e.stopPropagation()}>
            {isVideo ? (
              <video src={url} controls autoPlay className="w-full max-h-[85vh] rounded-xl" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="" className="w-full max-h-[85vh] object-contain rounded-xl mx-auto" />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}