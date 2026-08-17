import type { Profile } from "@/lib/api";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { MapPin, CircleCheck } from "lucide-react";

interface AboutStat {
  label: string;
  value: string;
}

function buildStats(settings: Record<string, string>): AboutStat[] {
  const stats: AboutStat[] = [];
  if (settings.YearsExperience) stats.push({ label: "Years Experience", value: settings.YearsExperience });
  if (settings.ProjectsDelivered) stats.push({ label: "Projects Delivered", value: settings.ProjectsDelivered });
  if (settings.TechnologiesCount) stats.push({ label: "Technologies", value: settings.TechnologiesCount });
  return stats;
}

function StatCard({ stat }: { stat: AboutStat }) {
  return (
    <div className="card p-4 text-center">
      <p className="font-display text-2xl font-bold text-accent mb-1">{stat.value}</p>
      <p className="text-xs text-text-muted">{stat.label}</p>
    </div>
  );
}

export default function About({ profile, settings }: { profile: Profile; settings: Record<string, string> }) {
  const stats = buildStats(settings);

  return (
    <section id="about" className="section-center py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow="About" title="Who I am" />
        </Reveal>

        <div className="grid md:grid-cols-[1.6fr_1fr] gap-10">
          <Reveal delay={80}>
            <div>
              <p className="text-text-muted text-lg leading-relaxed whitespace-pre-line mb-6">
                {profile.aboutDescription}
              </p>

              {stats.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {stats.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={18} className="text-accent shrink-0" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CircleCheck size={18} className="text-accent shrink-0" />
                <span>{profile.availabilityStatus}</span>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs uppercase tracking-wide text-text-muted mb-2">Focus areas</p>
                <div className="flex flex-wrap gap-2">
                  {profile.titles.map((title) => (
                    <span key={title} className="badge">
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}