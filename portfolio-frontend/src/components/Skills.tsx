import type { SkillCategory } from "@/lib/api";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import {
  Code2,
  Layout,
  Database,
  FlaskConical,
  Layers,
  Wrench,
  FileText,
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  Workflow,
  Rocket,
} from "lucide-react";

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ size?: number }>
> = {
  "Programming Languages": Code2,
  "Web Development": Layout,
  Databases: Database,
  "Software Testing / QA": FlaskConical,
  "Core Concepts": Layers,
  "Tools & Platforms": Wrench,
  Documentation: FileText,
  "AI & Machine Learning": BrainCircuit,
  "Authentication & Security": ShieldCheck,
  "Testing & CI/CD": Workflow,
  "Deployment & DevOps": Rocket,
};

function SkillCategoryCard({
  category,
  index,
}: {
  category: SkillCategory;
  index: number;
}) {
  const Icon = CATEGORY_ICONS[category.name] ?? Sparkles;

  return (
    <Reveal delay={index * 80}>
      <div className="card group relative h-full overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
        {/* Subtle accent glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Category header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
            <Icon size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="font-display text-sm font-bold leading-snug text-text">
              {category.name}
            </h3>

            <div className="mt-1 h-0.5 w-8 rounded-full bg-accent/70 transition-all duration-300 group-hover:w-12" />
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <span key={skill.name} className="tag">
             {skill.name}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function Skills({
  categories,
}: {
  categories: SkillCategory[];
}) {
  if (categories.length === 0) return null;

  return (
    <section id="skills" className="relative py-12 md:py-16 px-6 bg-bg-soft">
      {/* Subtle visual separation */}
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />

      <div className="relative max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Skills"
            title="What I work with"
            description="Constantly learning and improving across the full development stack."
          />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {categories.map((category, i) => (
            <SkillCategoryCard
              key={category.name}
              category={category}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}