export default function QaBadge() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-bg-soft text-xs font-mono"
      title="Not a real test suite — just an old QA habit that never quite left."
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-text-muted">
        <span className="text-text font-semibold">127 tests passing</span>
        {" · 0 known bugs · "}
        Last regression pass: {today}
      </span>
    </div>
  );
}