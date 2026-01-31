"use client";

import { CaseStudy } from "@/data/case-studies";
import { PasswordGate } from "@/components";
import { BackButton } from "./BackButton";
import { HeroImage } from "./HeroImage";
import { ProjectMeta } from "./ProjectMeta";
import { TableOfContents } from "./TableOfContents";
import { twMerge } from "tailwind-merge";

interface Section {
  id: string;
  title: string;
}

interface CaseStudyLayoutProps {
  caseStudy: CaseStudy;
  children: React.ReactNode;
  sections?: Section[];
}

// Width wrapper components for flexible content layouts
export function NarrowContent({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={twMerge("mx-auto w-full max-w-[800px] px-4 md:px-8 flex flex-col gap-10", className)}>
      {children}
    </div>
  );
}

export function WideContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={twMerge("mx-auto w-full max-w-[1100px] px-4 md:px-8", className)}>
      {children}
    </div>
  );
}

export function FullWidthContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={twMerge("w-full max-w-[1920px] mx-auto px-4 md:px-8", className)}>
      {children}
    </div>
  );
}

function LayoutContent({ caseStudy, children, sections }: CaseStudyLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--page-background)] overflow-x-hidden">
      {/* Floating Table of Contents */}
      {sections && sections.length > 0 && <TableOfContents sections={sections} />}
      
      <div className="py-4 md:py-8">
        <main className="flex flex-col gap-10 py-4 min-w-0">
          {/* Back Button */}
          <div className="mx-auto w-full max-w-[800px] px-4 md:px-8">
            <BackButton />
          </div>

          {/* Hero + Content Wrapper */}
          <div className="flex flex-col gap-6 sm:gap-10">
            <div className="flex flex-col gap-0 sm:gap-0">
              {/* Hero Image/Video */}
              <div className="mx-auto w-full max-w-[1240px] px-4 md:px-8">
                <HeroImage bgColor={caseStudy.heroColor} imageSrc={caseStudy.heroVideo || caseStudy.heroImage} videoPoster={caseStudy.heroVideoPoster} />
              </div>

              {/* Project Metadata - overlaps hero */}
              <div className="mx-auto w-full max-w-[800px] px-4 md:px-8 md:-mt-[130px] relative z-10">
                <ProjectMeta
                  subtitle={caseStudy.subtitle}
                  timeline={caseStudy.timeline}
                  role={caseStudy.role}
                  team={caseStudy.team}
                />
              </div>
            </div>

            {/* Case Study Content */}
            {children}

            {/* Bottom spacer */}
            <div className="h-[200px]" />
          </div>
        </main>
      </div>
    </div>
  );
}

export function CaseStudyLayout({ caseStudy, children, sections }: CaseStudyLayoutProps) {
  if (caseStudy.protected) {
    return (
      <PasswordGate slug={caseStudy.slug}>
        <LayoutContent caseStudy={caseStudy} children={children} sections={sections} />
      </PasswordGate>
    );
  }

  return <LayoutContent caseStudy={caseStudy} children={children} sections={sections} />;
}
