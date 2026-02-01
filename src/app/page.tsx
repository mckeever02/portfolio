"use client";

import {
  ProfileHeader,
  StatusInfo,
  SectionNav,
  SocialLinks,
  StatCard,
  WorkCard,
  ProjectCard,
  Timeline,
  PixelRevealImage,
} from "@/components";
import { useActiveSection } from "@/hooks/useActiveSection";
import { caseStudies } from "@/data/case-studies";

const sections = ["works", "projects", "about"] as const;

export default function Home() {
  const activeSection = useActiveSection(sections);

  return (
    <div className="min-h-screen bg-[var(--page-background)]">
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 lg:gap-24 xl:gap-32 p-4 md:p-8">
        {/* Fixed Left Sidebar */}
        <aside aria-label="Profile and navigation" className="md:sticky md:top-4 lg:top-8 h-fit flex flex-col gap-10 md:gap-16 px-1 py-4 lg:py-8">
          <ProfileHeader />
          <StatusInfo />
          <SectionNav activeSection={activeSection} />
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
                title={caseStudies["agentic-autofill"].title}
                description={caseStudies["agentic-autofill"].description}
                year="2025"
                role={caseStudies["agentic-autofill"].role}
                company={caseStudies["agentic-autofill"].company}
                bgColor={caseStudies["agentic-autofill"].heroColor}
                videoUrl={caseStudies["agentic-autofill"].heroVideo}
                videoPoster={caseStudies["agentic-autofill"].heroVideoPoster}
                videoPreload="metadata"
                href={`/work/${caseStudies["agentic-autofill"].slug}`}
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
              />
              <WorkCard
                title={caseStudies.verifier.title}
                description={caseStudies.verifier.description}
                year="2025"
                role={caseStudies.verifier.role}
                company={caseStudies.verifier.company}
                bgColor={caseStudies.verifier.heroColor}
                videoUrl={caseStudies.verifier.heroVideo}
                videoPoster={caseStudies.verifier.heroVideoPoster}
                href={`/work/${caseStudies.verifier.slug}`}
              />
              <WorkCard
                title="Account Management"
                description="Bringing long-anticipated account functionality to 1Password's desktop and mobile apps."
                year="2022"
                role="Design Lead"
                company="1Password"
                bgColor="#0B185A"
                videoUrl="/images/account-management-card-hero.mp4"
                videoPoster="/images/account-management-card-hero.jpg"
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
                videoUrl="/images/1p8-mobile-card-hero.mp4"
                videoPoster="/images/1p8-mobile-card-hero.jpg"
                href="https://1password.com/blog/1password-8-ios-android"
                externalLink
              />
              <WorkCard
                title="Sweepr"
                description="Designed a multimodal design system for self-service tech support across mobile, voice, and smart displays."
                year="2019"
                role="Product Design & development"
                company="Sweepr"
                bgColor="#8FC2A5"
                videoUrl="/images/sweepr-card-hero.mp4"
                videoPoster="/images/sweepr-card-hero.jpg"
                href="https://v3.mckvr.design/case-studies/multimodal-design-system"
                externalLink
                hoverLabel="View case study"
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
                role="Side project"
                bgColor="#000000"
                videoUrl="/images/pilgrim-card-hero.mp4"
                videoPoster="/images/pilgrim-card-hero.jpg"
                href="https://pilgrim.click"
                externalLink
              />
              <ProjectCard
                title="Headway"
                description="A Chrome extension that replaces the default new tab page with a simple, customizable todo app."
                year="2023"
                role="Side project"
                bgColor="#f5f0e8"
                imageUrl="/images/headway-card-hero.jpg"
                href="https://chromewebstore.google.com/detail/headway-%E2%80%94-new-tab-todo-li/nnmkipmghijjolehhibjjmmlpdgnkpgi"
                externalLink
              />
              <ProjectCard
                title="Mailtolink"
                description="A weekend project that turned into the most popular mailto link generator. Acquired in 2022."
                year="2019"
                role="Side project"

                bgColor="#c8f0e8"
                imageUrl="/images/mailtolink-card-hero.png"
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
            
            {/* About Photos */}
            <div className="flex gap-4 h-[280px] sm:h-[320px] md:h-[360px]">
              <div className="relative h-full overflow-hidden flex-shrink-0">
                <PixelRevealImage
                  src="/images/michael-mckeever-mournes-2.jpg"
                  alt="Michael McKeever in the Mourne Mountains"
                  width={240}
                  height={360}
                  className="h-full w-auto"
                  pixelSize={24}
                  duration={600}
                />
              </div>
              <div className="relative h-full overflow-hidden flex-grow">
                <PixelRevealImage
                  src="/images/michael-mckeever-british-columbia.jpeg"
                  alt="Michael McKeever in British Columbia"
                  width={480}
                  height={360}
                  className="h-full w-full"
                  pixelSize={24}
                  delay={250}
                  duration={600}
                />
              </div>
            </div>

            {/* Bio */}
            <p className="text-lg leading-relaxed text-[var(--foreground)]">
                I’m a product designer with over 11 years of experience designing and shipping products used by millions of people. I enjoy working at both ends of the spectrum—building new products from the ground up and improving existing ones through continuous iteration and research.
            </p>

            <p className="text-lg leading-relaxed text-[var(--foreground)]">
              I believe in prototypes over PRDs. I'm deeply curious and have a strong conviction that craft and attention to detail are key differentiators in the age of AI.
            </p>

              <p className="text-lg leading-relaxed text-[var(--foreground)]">
                At 1Password, I lead design for AI, shaping security features for AI Agents and guiding how AI is integrated into the product in a thoughtful, security-first way.
              </p>

            {/* Timeline */}
            <Timeline />
          </section>

        </main>
      </div>

      {/* Footer - full width, centered below sidebar and main */}
      <footer className="py-8">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 flex justify-center">
          <SocialLinks horizontal />
        </div>
      </footer>
    </div>
  );
}
