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
            <div className="flex flex-col gap-6">
              <WorkCard
                title="Verifier"
                description="0 → 1 design for a verification system to combat deepfakes and AI fraud"
                year="2025"
                role="Design Lead"
                company="1Password"
                bgColor="#c9e8e3"
                imageUrl="/images/verifier-hero.jpg"
                href="/work/verifier"
              />
              <WorkCard
                title="Account Management"
                description="Bringing long-anticipated account functionality to 1Password's desktop and mobile apps."
                year="2022"
                role="Design Lead"
                company="1Password"
                bgColor="#1a1a1a"
                videoUrl="/images/1password-account-management.mp4"
                href="https://1password.com/blog/manage-accounts-in-the-1password-app"
                externalLink
              />
              <WorkCard
                title="1Password 8 for mobile"
                description="Teamed up with 2 other designers to design and ship 1Password 8 to millions."
                year="2020"
                role="Product Design"
                company="1Password"
                bgColor="#0a2540"
                videoUrl="/images/1p8-mobile.mp4"
                href="https://1password.com/blog/1password-8-ios-android"
                externalLink
              />
              <WorkCard
                title="Sweepr"
                description="Self-service customer support solution for leading UK ISPs"
                year="2019"
                role="Product Design & frontend development"
                company="Sweepr"
                bgColor="#6c47ff"
                videoUrl="/images/sweepr-splash.mp4"
                href="https://v3.mckvr.design/case-studies/multimodal-design-system"
                externalLink
              />
            </div>
          </section>

          {/* Side Projects Section */}
          <section id="projects" className="flex flex-col gap-6 scroll-mt-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Side projects
            </h2>
            <div className="flex flex-col gap-6">
              <ProjectCard
                title="Pilgrim"
                description="Virtual mentors for those feeling lost. An experiment in designing and building for Generative AI."
                year="2024"
                bgColor="#000000"
                videoUrl="/images/pilgrim.mp4"
                href="https://pilgrim.click"
                externalLink
              />
              <ProjectCard
                title="Headway"
                description="A Chrome extension that replaces the default new tab page with a simple, customizable todo app."
                year="2023"
                bgColor="#f5f0e8"
                imageUrl="/images/headway-splash.jpg"
                href="https://chromewebstore.google.com/detail/headway-%E2%80%94-new-tab-todo-li/nnmkipmghijjolehhibjjmmlpdgnkpgi"
                externalLink
              />
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="flex flex-col gap-6 scroll-mt-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              About
            </h2>
            
            {/* Image Carousel */}
            <ImageCarousel />

            {/* Bio */}
            <p className="text-lg leading-relaxed text-[var(--foreground)]">
                I’m a product designer with over 11 years of experience designing and shipping products used by millions of people. I enjoy working at both ends of the spectrum—building new products from the ground up and improving existing ones through continuous iteration and research.
            </p>

              <p className="text-lg leading-relaxed text-[var(--foreground)]">
                At 1Password, I lead design for AI, shaping security features for AI Agents and guiding how AI is integrated into the product in a thoughtful, security-first way.
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
