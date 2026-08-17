import type { Experience as ExperienceType } from "@/lib/api";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Experience({ items }: { items: ExperienceType[] }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="py-20 md:py-28 px-6 bg-bg-soft">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Experience" title="Where I've worked" />
        </Reveal>

        <div className="relative border-l border-border pl-8 space-y-10 max-w-3xl">
          {items.map((item, i) => (
            <Reveal key={`${item.company}-${item.startDate}`} delay={i * 100}>
              <div className="relative">
                <span className="absolute -left-[calc(2rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" />

                <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">
                  {item.startDate} — {item.isCurrent ? "Present" : item.endDate}
                </p>
                <h3 className="font-display text-lg font-bold">{item.jobTitle}</h3>
                <p className="text-text-muted text-sm mb-3">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ""}
                </p>

                <ul className="space-y-2 mb-3">
                  {item.responsibilities.map((r, idx) => (
                    <li key={idx} className="text-sm text-text-muted leading-relaxed flex gap-2">
                      <span className="text-accent mt-1.5 shrink-0">▸</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                {item.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
