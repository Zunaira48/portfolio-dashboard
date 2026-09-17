import { Sparkles } from "lucide-react";

const AI_KEYWORDS = [
  "ai", "ml", "model", "embedding", "llm", "gpt", "gemini",
  "neural", "vector", "rag", "nlp", "inference",
];

function isAiStage(stage: string) {
  const lower = stage.toLowerCase();
  return AI_KEYWORDS.some((kw) => new RegExp(`\\b${kw}\\b`).test(lower));
}

function StageBox({ stage }: { stage: string }) {
  const ai = isAiStage(stage);
  return (
    <div
      className={`flex items-center justify-center gap-1.5 text-center px-4 py-3 rounded-xl border text-sm font-semibold shrink-0 min-w-28 ${
        ai
          ? "border-accent bg-accent-soft text-accent shadow-[0_0_16px_-4px_var(--color-accent)]"
          : "border-border bg-bg-soft text-text"
      }`}
    >
      {ai ? <Sparkles size={14} className="shrink-0" /> : null}
      <span>{stage}</span>
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
  const clean = stages.map((s) => s.trim()).filter(Boolean);
  if (clean.length < 2) return null;

  return (
    <div className="mb-8">
      <p className="text-xs uppercase tracking-wide text-accent font-semibold mb-4">
        Architecture
      </p>
      <div className="card p-5 flex flex-col md:flex-row md:flex-wrap items-center gap-1 md:gap-0">
        {clean.map((stage, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center">
            <StageBox stage={stage} />
            {i < clean.length - 1 ? (
              <>
                <HorizontalConnector />
                <VerticalConnector />
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}