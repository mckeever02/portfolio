"use client";

import { CaseStudy } from "@/data/case-studies";
import { PageTransition, PasswordGate } from "@/components";
import { BackButton } from "./BackButton";
import { HeroImage } from "./HeroImage";
import { ProjectMeta } from "./ProjectMeta";

interface CaseStudyLayoutProps {
  caseStudy: CaseStudy;
  children: React.ReactNode;
}

// Width wrapper components for flexible content layouts
export function NarrowContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[800px] px-4 md:px-8 flex flex-col gap-10 ${className}`}>
      {children}
    </div>
  );
}

export function WideContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1100px] px-4 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function FullWidthContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

function LayoutContent({ caseStudy, children }: CaseStudyLayoutProps) {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--background)]">
        <div className="py-4 md:py-8">
          <main className="flex flex-col gap-10 py-4 min-w-0">
            {/* Back Button */}
            <div className="mx-auto w-full max-w-[800px] px-4 md:px-8">
              <BackButton />
            </div>

            {/* Hero + Content Wrapper */}
            <div className="flex flex-col gap-10">
              {/* Hero Image/Video */}
              <div className="mx-auto w-full max-w-[1000px] px-4 md:px-8">
                <HeroImage bgColor={caseStudy.heroColor} imageSrc={caseStudy.heroImage} />
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

              {/* Case Study Content */}
              {children}

              {/* Bottom spacer */}
              <div className="h-[200px]" />
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
}

export function CaseStudyLayout({ caseStudy, children }: CaseStudyLayoutProps) {
  if (caseStudy.protected) {
    return (
      <PasswordGate slug={caseStudy.slug}>
        <LayoutContent caseStudy={caseStudy} children={children} />
      </PasswordGate>
    );
  }

  return <LayoutContent caseStudy={caseStudy} children={children} />;
}
