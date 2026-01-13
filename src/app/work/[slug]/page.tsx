"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { getCaseStudy } from "@/data/case-studies";
import {
  CaseStudySidebar,
  HeroImage,
  ProjectMeta,
  ContentSection,
  ProblemSection,
  TiltedImageGrid,
  QuoteCard,
} from "@/components/case-study";
import { PageTransition } from "@/components";
import { useActiveSection } from "@/hooks/useActiveSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CaseStudyPage({ params }: PageProps) {
  const { slug } = use(params);
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const sectionIds = caseStudy.sections.map((s) => s.id);
  const activeSection = useActiveSection(sectionIds);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 p-4 md:p-8">
        {/* Fixed Left Sidebar */}
        <CaseStudySidebar
          title={caseStudy.title}
          company={caseStudy.company}
          sections={caseStudy.sections}
          activeSection={activeSection}
        />

        {/* Scrollable Right Content */}
        <main className="flex flex-col gap-10 py-4 lg:py-8 min-w-0">
          {/* Hero Image */}
          <HeroImage bgColor={caseStudy.heroColor} />

          {/* Project Metadata */}
          <ProjectMeta
            subtitle={caseStudy.subtitle}
            timeline={caseStudy.timeline}
            role={caseStudy.role}
            team={caseStudy.team}
          />

          {/* Overview Section */}
          <ContentSection id="overview" title="Overview">
            <p className="text-xl leading-relaxed tracking-[-0.2px] text-[var(--foreground)]">
              The 1Password Labs team wanted to explore how 1Password&apos;s verification of trust method and mobile app could be utilised in an employee to employee verification scenario.
            </p>
          </ContentSection>

          {/* The Problem Section */}
          <ProblemSection
            id="problem"
            title="The problem"
            phoneFrame="/images/iphone-frame.svg"
            phoneContent="/images/imessage-window.png"
            bubbleOverlay="/images/bubble.png"
            stat="$1bn"
            headline="Deepfake scams and AI-based fraud amounted to over $1bn in losses in 2025."
            body="Employees can no longer be certain if the colleague they are interacting with is who they say they are."
          />

          {/* Why 1Password Section */}
          <ContentSection id="why-1password" title="Why 1Password?">
            <p className="text-xl leading-relaxed tracking-[-0.2px] text-[var(--foreground)]">
              1Password is a password manager? What does it have to do with identity verification and assurance?
            </p>
          </ContentSection>

          {/* Defining Usecases Section */}
          <ContentSection id="usecases" title="Defining usecases">
            <p className="text-xl leading-relaxed tracking-[-0.2px] text-[var(--foreground)] mb-6">
              I wanted to make sure that the use cases were grounded in real pain points. So I did some workshopping with the team, and some desk research regarding cybersecurity threats and landed on these 4 usecases to design the solution around.
            </p>
            <TiltedImageGrid
              images={[
                { src: "/images/work/verifier/usecase-1.jpg", alt: "Use case 1" },
                { src: "/images/work/verifier/usecase-2.jpg", alt: "Use case 2" },
                { src: "/images/work/verifier/usecase-3.jpg", alt: "Use case 3" },
                { src: "/images/work/verifier/usecase-4.jpg", alt: "Use case 4" },
              ]}
            />
          </ContentSection>

          {/* Wireframing Section */}
          <ContentSection id="wireframing" title="Wireframing the flow">
            <div className="h-[597px] w-full bg-[var(--foreground)]/5 rounded" />
          </ContentSection>

          {/* The Flow Section */}
          <ContentSection id="flow" title="The flow">
            <div className="h-[400px] w-full bg-[var(--foreground)]/5 rounded" />
          </ContentSection>

          {/* RSA Section */}
          <ContentSection id="rsa" title="RSA San Francisco 2025">
            <p className="text-xl leading-relaxed tracking-[-0.2px] text-[var(--foreground)] mb-6">
              Verifier being demoed as part of the lineup of 1Password&apos;s booth at RSA Conference 2025.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1 aspect-[4/3] bg-[var(--foreground)]/5 rounded overflow-hidden">
                  {/* Image placeholder */}
                </div>
                <div className="flex-1 aspect-[4/3] bg-[var(--foreground)]/5 rounded overflow-hidden">
                  {/* Image placeholder */}
                </div>
              </div>
              <QuoteCard
                quote="You're right in my sweet spot. Massive value. You should double down on this."
                attribution="Security Professional at RSA"
              />
              <div className="w-full aspect-[889/684] bg-[var(--foreground)]/5 rounded overflow-hidden">
                {/* Large image placeholder */}
              </div>
            </div>
          </ContentSection>

          {/* Bottom spacer */}
          <div className="h-[200px]" />
        </main>
      </div>
    </div>
    </PageTransition>
  );
}
