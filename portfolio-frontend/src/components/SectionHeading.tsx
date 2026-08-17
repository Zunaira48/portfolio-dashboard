export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <span className="badge mb-4 inline-block">{eyebrow}</span>
      <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h2>
      {description ? <p className="text-text-muted text-lg leading-relaxed">{description}</p> : null}
    </div>
  );
}
