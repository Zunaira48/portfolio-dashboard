"use client";

import { useEffect, useState } from "react";

type Status = "checking" | "online" | "offline";

export default function BackendStatus() {
  const [status, setStatus] = useState<Status>("checking");
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5216";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // Render free tier can cold-start slowly
    const start = performance.now();

    fetch(`${API_URL}/health`, { signal: controller.signal })
      .then((res) => {
        clearTimeout(timeout);
        setLatency(Math.round(performance.now() - start));
        setStatus(res.ok ? "online" : "offline");
      })
      .catch(() => {
        clearTimeout(timeout);
        setStatus("offline");
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const dotColor = status === "online" ? "bg-green-500" : status === "offline" ? "bg-red-500" : "bg-yellow-500";
  const label =
    status === "checking"
      ? "Checking API status…"
      : status === "online"
      ? `API status: Online${latency !== null ? ` (${latency}ms)` : ""}`
      : "API status: Offline";

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-bg-soft text-xs font-mono">
      <span className="relative flex h-2 w-2 shrink-0">
        {status === "online" ? (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
        ) : null}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      <span className="text-text-muted">{label}</span>
    </div>
  );
}