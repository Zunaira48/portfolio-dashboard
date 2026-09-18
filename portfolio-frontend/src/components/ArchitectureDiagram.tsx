import { Sparkles } from "lucide-react";

const AI_KEYWORDS = [
  "ai", "ml", "model", "embedding", "llm", "gpt", "gemini",
  "neural", "vector", "rag", "nlp", "inference", "llama", "ollama",
];

function isAiStage(stage: string) {
  const lower = stage.toLowerCase();
  return AI_KEYWORDS.some((kw) => new RegExp(`\\b${kw}\\b`).test(lower));
}

interface ParsedStage {
  title: string | null;
  items: string[];
}

function parseStageLine(raw: string): ParsedStage {
  if (raw.includes("|")) {
    const colonIdx = raw.indexOf(":");
    if (colonIdx > -1) {
      const title = raw.slice(0, colonIdx).trim();
      const items = raw.slice(colonIdx + 1).split("|").map((s) => s.trim()).filter(Boolean);
      if (title && items.length > 1) return { title, items };
    }
    return { title: null, items: raw.split("|").map((s) => s.trim()).filter(Boolean) };
  }
  return { title: null, items: [raw.trim()] };
}

function StagePill({ label, small }: { label: string; small?: boolean }) {
  const ai = isAiStage(label);
  return (
    <div
      className={`flex items-center justify-center gap-1.5 text-center rounded-lg border font-semibold shrink-0 ${
        small ? "px-3 py-1.5 text-xs" : "px-4 py-3 text-sm min-w-28"
      } ${
        ai
          ? "border-accent bg-accent-soft text-accent shadow-[0_0_16px_-4px_var(--color-accent)]"
          : "border-border bg-bg-soft text-text"
      }`}
    >
      {ai ? <Sparkles size={small ? 12 : 14} className="shrink-0" /> : null}
      <span>{label}</span>
    </div>
  );
}

function StageGroup({ stage }: { stage: ParsedStage }) {
  if (stage.items.length === 1 && !stage.title) {
    return <StagePill label={stage.items[0]} />;
  }
  return (
    <div className="flex flex-col gap-1.5 p-2.5 rounded-xl border border-dashed border-border shrink-0">
      {stage.title ? (
        <p className="text-[10px] uppercase tracking-wide text-text-muted font-semibold text-center px-1">
          {stage.title}
        </p>
      ) : null}
      <div className="flex flex-col gap-1.5">
        {stage.items.map((label, i) => (
          <StagePill key={i} label={label} small />
        ))}
      </div>
    </div>
  );
}

function HorizontalConnector() {
  return (
    <svg className="hidden md:block w-10 h-6 shrink-0" viewBox="0 0 40 24" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="12" x2="32" y2="12" stroke="var(--color-border)" strokeWidth="2" />
      <line x1="0" y1="12" x2="32" y2="12" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="6 6" className="flow-dash" />
      <polygon points="32,6 40,12 32,18" fill="var(--color-accent)" />
    </svg>
  );
}

function VerticalConnector() {
  return (
    <svg className="block md:hidden w-6 h-8 shrink-0" viewBox="0 0 24 40" preserveAspectRatio="none" aria-hidden="true">
      <line x1="12" y1="0" x2="12" y2="32" stroke="var(--color-border)" strokeWidth="2" />
      <line x1="12" y1="0" x2="12" y2="32" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="6 6" className="flow-dash" />
      <polygon points="6,32 12,40 18,32" fill="var(--color-accent)" />
    </svg>
  );
}

export default function ArchitectureDiagram({ stages }: { stages: string[] }) {
  const parsed = stages.map((s) => s.trim()).filter(Boolean).map(parseStageLine);
  if (parsed.length < 2) return null;

  return (
    <div className="mb-8">
      <p className="text-xs uppercase tracking-wide text-accent font-semibold mb-4">
        Architecture
      </p>
      <div className="card p-5 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:flex-nowrap items-center gap-1 md:gap-0 md:w-max">
          {parsed.map((stage, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center">
              <StageGroup stage={stage} />
              {i < parsed.length - 1 ? (
                <>
                  <HorizontalConnector />
                  <VerticalConnector />
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}