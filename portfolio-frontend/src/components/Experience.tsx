import type { Experience as ExperienceType } from "@/lib/api";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Experience({ items }: { items: ExperienceType[] }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="py-10 md:py-14 px-6 bg-bg-soft">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Experience" title="Where I've worked" />
        </Reveal>

        <div className="relative max-w-5xl mx-auto">
          {/* Center connecting line — desktop only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-[color-mix(in_srgb,var(--color-accent)_35%,transparent)]" />
          {/* Left-edge connecting line — mobile only */}
          <div className="md:hidden absolute left-0 top-0 bottom-0 w-0.5 bg-[color-mix(in_srgb,var(--color-accent)_35%,transparent)]" />

          <div className="space-y-8 md:space-y-12">
            {items.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <Reveal key={`${item.company}-${item.startDate}`} delay={i * 100}>
                  <div className="relative pl-8 md:pl-0 md:grid md:grid-cols-2 md:gap-10 items-start">
                    <span
                      className="absolute left-0 md:left-1/2 top-6 w-3 h-3 rounded-full -translate-x-1/2 z-10 bg-(--color-accent) shadow-[0_0_0_4px_var(--color-accent-soft)]"
                    />

                    <div className={isLeft ? "md:col-start-1" : "md:col-start-2"}>
                      <div className="card p-6">
                        <h3 className="font-display text-lg font-bold mb-1">{item.jobTitle}</h3>
                        <p className="text-accent font-semibold text-sm mb-2">{item.company}</p>

                        <p className="text-text-muted text-xs mb-4 flex flex-wrap items-center gap-x-2">
                          <span>
                            {item.startDate} — {item.isCurrent ? "Present" : item.endDate}
                          </span>
                          {item.location ? <span>· {item.location}</span> : null}
                        </p>

                        <div
                          className="rich-content text-sm text-text-muted leading-relaxed mb-4"
                          dangerouslySetInnerHTML={{ __html: item.responsibilities }}
                        />

                        {item.technologies.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {item.technologies.map((tech) => (
                              <span key={tech} className="tag">
                                {tech}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}