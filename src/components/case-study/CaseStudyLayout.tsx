"use client";

import { CaseStudy, getAdjacentCaseStudies } from "@/data/case-studies";
import { PasswordGate, ProjectCard } from "@/components";
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
  const { prev, next } = getAdjacentCaseStudies(caseStudy.slug);
  const linkedCaseStudy = next || prev;
  
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

            {/* Related Case Study Section */}
            {linkedCaseStudy && (
              <div>
                {/* Full-width zig zag divider */}
                <div className="py-12">
                  <div 
                    className="w-screen relative h-3 opacity-20 bg-[var(--foreground)] [mask-image:url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2212%22%20viewBox%3D%220%200%2016%2012%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%206L8%2011L16%206%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] [mask-repeat:repeat-x] [mask-size:16px_12px] [mask-position:left_center]"
                  />
                </div>
                
                <div className="mx-auto w-full max-w-[800px] px-4 md:px-8 pb-16">
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
                    Up next
                  </h2>
                  <ProjectCard
                    title={linkedCaseStudy.title}
                    description={linkedCaseStudy.description}
                    year={linkedCaseStudy.timeline}
                    role={linkedCaseStudy.role}
                    bgColor={linkedCaseStudy.heroColor}
                    href={`/work/${linkedCaseStudy.slug}`}
                    videoUrl={linkedCaseStudy.heroVideo}
                    videoPoster={linkedCaseStudy.heroVideoPoster}
                    imageUrl={linkedCaseStudy.heroImage}
                  />
                </div>
              </div>
            )}
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
