"use client";

import {
  ProfileHeader,
  StatusInfo,
  SectionNav,
  StatCard,
  WorkCard,
  ProjectCard,
  ImageCarousel,
  Timeline,
  PageTransition,
} from "@/components";
import { useActiveSection } from "@/hooks/useActiveSection";

const sections = ["works", "projects", "about"] as const;

export default function Home() {
  const activeSection = useActiveSection(sections);

  return (
    <PageTransition direction="back">
      <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 p-4 md:p-8">
        {/* Fixed Left Sidebar */}
        <aside className="lg:sticky lg:top-8 h-fit flex flex-col gap-10 lg:gap-16 px-1 py-4 lg:py-8">
          <ProfileHeader />
          <StatusInfo />
          <SectionNav activeSection={activeSection} />
        </aside>

        {/* Scrollable Right Content */}
        <main className="flex flex-col gap-10 py-4 lg:py-8 min-w-0">
          {/* Stats Row */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
            <StatCard value={11} label="Years experience" />
            <StatCard value={456} label="Github commits" />
            <StatCard value={14} label="Side projects" />
          </div>

          {/* Selected Works Section */}
          <section id="works" className="flex flex-col gap-6 scroll-mt-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Selected Works
            </h2>
            <div className="flex flex-col">
              <WorkCard
                title="1Password Verifier"
                description="0 → 1 design for an identity verification system"
                year="2025"
                role="Lead Designer"
                company="1Password"
                bgColor="#c9e8e3"
                imageUrl="/images/verifier-hero.jpg"
                href="/work/verifier"
              />
            </div>
          </section>

          {/* Side Projects Section */}
          <section id="projects" className="flex flex-col gap-6 scroll-mt-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Side projects
            </h2>
            <div className="flex flex-col">
              <ProjectCard
                title="Pilgrim"
                description="0 → 1 design for an identity verification system"
                year="2025"
                bgColor="#000000"
                href="/side-project/pilgrim"
              />
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="flex flex-col gap-6 scroll-mt-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              About
            </h2>
            
            {/* Image Carousel */}
            <ImageCarousel />

            {/* Bio */}
            <p className="text-lg leading-relaxed text-[var(--foreground)]">
              As a product designer hailing from the vibrant city of Belfast, Northern Ireland, I have a knack for transforming ideas into tangible, user-friendly products. With a background in software design, I thrive on the challenge of marrying functionality with aesthetics. My passion lies in crafting experiences that not only meet user needs but also bring a smile to their faces. When I&apos;m not sketching out the next big thing, you can find me exploring the local coffee scene or attempting to perfect my scone recipe—because what&apos;s design without a little bit of deliciousness?
            </p>

            {/* Timeline */}
            <Timeline />
          </section>

          {/* Bottom spacer */}
          <div className="h-[200px]" />
        </main>
      </div>
    </div>
    </PageTransition>
  );
}
