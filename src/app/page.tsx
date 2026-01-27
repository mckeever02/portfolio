"use client";

import {
  ProfileHeader,
  StatusInfo,
  SectionNav,
  SocialLinks,
  StatCard,
  WorkCard,
  ProjectCard,
  ImageCarousel,
  Timeline,
  PageTransition,
} from "@/components";
import { useActiveSection } from "@/hooks/useActiveSection";
import { caseStudies } from "@/data/case-studies";

const sections = ["works", "projects", "about"] as const;

export default function Home() {
  const activeSection = useActiveSection(sections);

  return (
    <PageTransition direction="back">
      <a 
        href="#works" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[var(--foreground)] focus:text-[var(--background)] focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>
      <div className="min-h-screen bg-[var(--page-background)]">
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 lg:gap-24 xl:gap-32 p-4 lg:p-8">
        {/* Fixed Left Sidebar */}
        <aside aria-label="Profile and navigation" className="md:sticky md:top-4 lg:top-8 h-fit flex flex-col gap-10 md:gap-16 px-1 py-4 lg:py-8">
          <ProfileHeader />
          <StatusInfo />
          <SectionNav activeSection={activeSection} />
          {/* Social links - hidden on mobile, shown in sidebar on desktop */}
          <div className="hidden md:block">
            <SocialLinks />
          </div>
        </aside>

        {/* Scrollable Right Content */}
        <main className="flex flex-col gap-10 py-4 lg:py-8 min-w-0">
          {/* Stats Row */}
          {/* <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
            <StatCard value={11} label="Years experience" />
            <StatCard value={456} label="Github commits" />
            <StatCard value={14} label="Side projects" />
          </div> */}

          {/* Selected Works Section */}
          <section id="works" className="flex flex-col gap-6 scroll-mt-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Selected Works
            </h2>
            <div className="flex flex-col gap-6">
              <WorkCard
                title="Autofill for AI Agents"
                description="Led the design for a brand new experience that allows AI agents to authenticate and act online using 1Password."
                year="2025"
                role="Design Lead"
                company="1Password"
                bgColor="#DD4825"
                imageUrl="/images/agentic-autofill-hero.jpg"
                href="https://www.youtube.com/watch?v=c3tqMe2_UwQ"
                externalLink
              />
              <WorkCard
                title={caseStudies.sentinel.title}
                description={caseStudies.sentinel.description}
                year="2025"
                role={caseStudies.sentinel.role}
                company={caseStudies.sentinel.company}
                bgColor={caseStudies.sentinel.heroColor}
                videoUrl={caseStudies.sentinel.heroVideo}
                videoPoster={caseStudies.sentinel.heroVideoPoster}
                href={`/work/${caseStudies.sentinel.slug}`}
                comingSoon
              />
              <WorkCard
                title={caseStudies.verifier.title}
                description={caseStudies.verifier.description}
                year="2025"
                role={caseStudies.verifier.role}
                company={caseStudies.verifier.company}
                bgColor={caseStudies.verifier.heroColor}
                imageUrl={caseStudies.verifier.heroImage}
                href={`/work/${caseStudies.verifier.slug}`}
              />
              <WorkCard
                title="Account Management"
                description="Bringing long-anticipated account functionality to 1Password's desktop and mobile apps."
                year="2022"
                role="Design Lead"
                company="1Password"
                bgColor="#0B185A"
                videoUrl="/images/1password-account-management.mp4"
                href="https://1password.com/blog/manage-accounts-in-the-1password-app"
                externalLink
              />
              <WorkCard
                title="1Password 8 for mobile"
                description="Co-designed the next-generation 1Password mobile experience to millions of customers worldwide."
                year="2021"
                role="Product Design"
                company="1Password"
                bgColor="#367BD9"
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
                bgColor="#8FC2A5"
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
                year="2025"
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
              <ProjectCard
                title="Mailtolink"
                description="A weekend project that turned into the most popular mailto link generator. Acquired in 2022."
                year="2019"
                bgColor="#c8f0e8"
                imageUrl="/images/mailtolink.jpg"
                href="https://mailtolink.me"
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

          {/* Social links - shown at bottom on mobile, hidden on desktop */}
          <div className="lg:hidden pt-8 border-t border-[var(--border)]">
            <SocialLinks />
          </div>

          {/* Bottom spacer */}
          <div className="h-[200px]" />
        </main>
      </div>
    </div>
    </PageTransition>
  );
}
