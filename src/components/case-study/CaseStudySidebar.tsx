"use client";

import { BackButton } from "./BackButton";
import { CaseStudyNav } from "./CaseStudyNav";

interface CaseStudySidebarProps {
  title: string;
  company: string;
  sections: { id: string; title: string }[];
  activeSection: string;
}

export function CaseStudySidebar({
  title,
  company,
  sections,
  activeSection,
}: CaseStudySidebarProps) {
  return (
    <aside className="lg:sticky lg:top-0 h-fit flex flex-col gap-10 lg:gap-16 px-1 py-4 lg:py-8">
      <BackButton />

      {/* Project Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{title}</h1>
        <p className="text-base text-[var(--foreground)]">{company}</p>
      </div>

      {/* Section Navigation */}
      <CaseStudyNav sections={sections} activeSection={activeSection} />
    </aside>
  );
}
