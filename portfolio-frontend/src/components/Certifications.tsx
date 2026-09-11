import type { Certification } from "@/lib/api";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { Award, ExternalLink } from "lucide-react";

export default function Certifications({ items }: { items: Certification[] }) {
  if (items.length === 0) return null;

  return (
    <section id="certifications" className="section-center py-12 md:py-16 px-6 bg-bg-soft">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Certifications" title="Credentials" />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((cert, i) => (
            <Reveal key={`${cert.title}-${cert.issueDate}`} delay={i * 80}>
              <div className="card p-6 h-full flex flex-col relative overflow-hidden">
                <div className="ribbon-wrap">
                  <span className="ribbon">Certified</span>
                </div>

                <div className="w-11 h-11 rounded-xl bg-accent-soft flex items-center justify-center mb-4 mt-2">
                  <Award size={20} className="text-accent" />
                </div>

                <h3 className="font-display text-lg font-bold mb-1">{cert.title}</h3>
                {cert.issuer ? <p className="text-text-muted text-sm mb-1">{cert.issuer}</p> : null}
                <p className="text-xs text-text-muted mb-3">
                  {cert.issueDate}
                  {cert.expiryDate ? ` – ${cert.expiryDate}` : ""}
                </p>

                {cert.description ? (
                  <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1">{cert.description}</p>
                ) : (
                  <div className="flex-1" />
                )}

                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-accent inline-flex items-center gap-1 mt-auto"
                  >
                    Verify <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
