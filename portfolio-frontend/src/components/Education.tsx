import type { Education as EducationType } from "@/lib/api";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { GraduationCap } from "lucide-react";

export default function Education({ items }: { items: EducationType[] }) {
  if (items.length === 0) return null;

  return (
    <section id="education" className="section-center py-12 md:py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Education" title="Academic background" />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {items.map((edu, i) => (
            <Reveal key={`${edu.institution}-${edu.startDate}`} delay={i * 100}>
              <div className="card p-6 flex gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-accent-soft flex items-center justify-center">
                  <GraduationCap size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">
                    {edu.startDate} — {edu.endDate ?? "Present"}
                  </p>
                  <h3 className="font-display text-lg font-bold mb-1">{edu.degree}</h3>
                  <p className="text-text-muted text-sm mb-2">
                    {edu.institution}
                    {edu.location ? ` · ${edu.location}` : ""}
                  </p>
                  {edu.specialization ? (
                    <p className="text-sm text-text-muted mb-1">Specialization: {edu.specialization}</p>
                  ) : null}
                  {edu.description ? <p className="text-sm text-text-muted leading-relaxed">{edu.description}</p> : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
