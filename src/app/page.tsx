"use client";

import { useState, useRef } from "react";
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
import Image from "next/image";

const toolkitItems = [
  { name: "Figma", icon: "/images/logos/figma-icon.png", tooltip: "Goes without saying right?" },
  { name: "Cursor", icon: "/images/logos/cursor-app-icon.png", tooltip: "My prototyping tool of choice" },
  { name: "ChatGPT", icon: "/images/logos/chatgpt-icon.png", tooltip: "Brainstorming, research and sound-boarding" },
  { name: "Notion", icon: "/images/logos/notion-icon.png", tooltip: "Project management and organisation" },
  { name: "Dia", icon: "/images/logos/dia-icon.png", tooltip: "My current AI browser of choice" },
  { name: "GitHub", icon: "/images/logos/github-icon.png", tooltip: "I'd be lost without version control" },
  { name: "Screen Studio", icon: "/images/logos/screen-studio-icon.png", tooltip: "Getting alignment through demos" },
];
import { useActiveSection } from "@/hooks/useActiveSection";
import { caseStudies } from "@/data/case-studies";
import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import "@/components/case-study/tooltip.css";

const sections = ["works", "projects", "about"] as const;

function ToolkitDock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMouseX(e.clientX);
    // Determine hovered index from mouse position
    if (!containerRef.current) return;
    let closest = -1;
    let closestDist = Infinity;
    itemRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - center);
      if (dist < closestDist && dist < rect.width) {
        closestDist = dist;
        closest = i;
      }
    });
    setHoveredIndex(closest >= 0 ? closest : null);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
    setHoveredIndex(null);
  };

  function getScale(index: number) {
    if (mouseX === null || !itemRefs.current[index]) return 1;
    const ref = itemRefs.current[index];
    if (!ref) return 1;
    const rect = ref.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - center);
    const maxDistance = 160;
    if (distance > maxDistance) return 1;
    const proximity = 1 - distance / maxDistance;
    return 1 + proximity * 0.18;
  }

  function getY(index: number) {
    if (mouseX === null || !itemRefs.current[index]) return 0;
    const ref = itemRefs.current[index];
    if (!ref) return 0;
    const rect = ref.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - center);
    const maxDistance = 160;
    if (distance > maxDistance) return 0;
    const proximity = 1 - distance / maxDistance;
    return -proximity * 4;
  }

  function getRotation(index: number) {
    if (mouseX === null || !itemRefs.current[index]) return 0;
    const ref = itemRefs.current[index];
    if (!ref) return 0;
    const rect = ref.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const offset = mouseX - center;
    const distance = Math.abs(offset);
    const maxDistance = 160;
    if (distance > maxDistance) return 0;
    const proximity = 1 - distance / maxDistance;
    // Rotate away from cursor — strongest for hovered, tapers off for adjacent
    const maxRotation = 3 * proximity;
    return offset > 0 ? -maxRotation : maxRotation;
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-bold tracking-[1.6px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)] mb-4">My Daily Drivers</h3>
      <Tooltip.Provider delayDuration={0}>
        <div
          ref={containerRef}
          className="-mx-4 px-4 flex items-end gap-3 cursor-help overflow-x-auto overflow-y-visible pt-12 -mt-12 pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-7 sm:gap-2 sm:overflow-visible sm:pt-0 sm:-mt-0 sm:pb-0 scrollbar-hide"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {toolkitItems.map((tool, index) => (
            <Tooltip.Root key={tool.name} open={hoveredIndex === index}>
              <Tooltip.Trigger asChild>
                <div
                  ref={(el) => { itemRefs.current[index] = el; }}
                  className="flex flex-col items-center gap-2 min-w-[72px] sm:min-w-0 w-full"
                >
                  <motion.div
                    className="relative w-[68px] h-[68px] sm:w-[76px] sm:h-[76px]"
                    animate={{
                      scale: getScale(index),
                      rotate: getRotation(index),
                      y: getY(index),
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                  >
                    <Image
                      src={tool.icon}
                      alt={`${tool.name} icon`}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </motion.div>
                  <div className="h-5 relative flex justify-center">
                    <motion.span
                      className="text-sm text-[var(--foreground)] whitespace-nowrap"
                      initial={{ y: 8, opacity: 0 }}
                      animate={{
                        y: hoveredIndex === index ? 0 : 8,
                        opacity: hoveredIndex === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {tool.name}
                    </motion.span>
                  </div>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={16}>
                  {tool.tooltip}
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </div>
      </Tooltip.Provider>
    </div>
  );
}

export default function Home() {
  const activeSection = useActiveSection(sections);
  const [statusHoverY, setStatusHoverY] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--page-background)]">
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 lg:gap-24 xl:gap-32 p-4 md:p-8">
        {/* Fixed Left Sidebar */}
        <aside aria-label="Profile and navigation" className="md:sticky md:top-4 lg:top-8 h-fit flex flex-col gap-10 md:gap-16 px-1 py-4 lg:py-8">
          <ProfileHeader />
          <StatusInfo onLinkHover={setStatusHoverY} />
          <SectionNav activeSection={activeSection} externalHoverY={statusHoverY} />
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
          <section id="about" className="flex flex-col gap-16 scroll-mt-8">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                About
              </h2>
            
              {/* About Photos */}
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto sm:overflow-visible scrollbar-hide">
                <div className="flex gap-4 h-[280px] sm:h-[320px] md:h-[360px] w-max sm:w-full">
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
                  <div className="relative h-full overflow-hidden flex-shrink-0 sm:flex-grow">
                    <PixelRevealImage
                      src="/images/michael-mckeever-british-columbia.jpeg"
                      alt="Michael McKeever in British Columbia"
                      width={480}
                      height={360}
                      className="h-full w-auto sm:w-full"
                      pixelSize={24}
                      delay={250}
                      duration={600}
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-6">
                <p className="text-3xl xl:text-4xl text-[var(--foreground)] leading-normal">I help companies build AI experiences which can scale securely.</p>

                <p className="text-lg leading-relaxed text-[var(--foreground)]">
                  I’m a product designer with over 11 years of experience designing and shipping products used by millions of people. I enjoy working at both ends of the spectrum—building new, 0 to 1 products from the ground up and improving upon existing ones through continuous iteration, testing and research.
                </p>

                <p className="text-lg leading-relaxed text-[var(--foreground)]">
                  Previously I was a frontend developer, so I'm a builder at heart – just as comfortable in code as I am in Figma. I'm deeply curious and have a strong conviction that craft and details will be the thing that matters in the age of AI.
                </p>

                <p className="text-lg leading-relaxed text-[var(--foreground)]">
                  At 1Password, I'm working on AI and Developer experiences – shaping the future of security and visibility for AI Agents.
                </p>
              </div>


            </div>

            

            {/* Toolkit */}
            <ToolkitDock />

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
