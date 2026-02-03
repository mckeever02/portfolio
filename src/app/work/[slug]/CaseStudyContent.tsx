"use client";

import { useRef, useState } from "react";
import { CaseStudy } from "@/data/case-studies";
import {
  CaseStudyLayout,
  NarrowContent,
  WideContent,
  FullWidthContent,
  ContentSection,
  QuoteCard,
  HackathonSection,
  BodyText,
  BodyList,
  StickyNotesGrid,
  FeatureCard,
  FeatureCardList,
  StatCard,
  Tabs,
} from "@/components/case-study";
import type { FeatureCardItem } from "@/components/case-study";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ZigZagDivider } from "@/components/ZigZagDivider";
import { SummaryCardDemo, CyclingPermissionCard, PromptGuidelineCard, MobilePermissionCard } from "@/components/SummaryCardDemo";
import { FlipCard, CardFace } from "@/components/FlipCard";
import { FlipCarousel } from "@/components/FlipCarousel";
import { SkewedTag } from "@/components/SkewedTag";
import { ImageCarousel } from "@/components/ImageCarousel";

// Helper for persona back content
function PersonaNeeds({ items }: { items: string[] }) {
  return (
    <>
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-[var(--foreground)]">What they want</h3>
      <ul className="text-[var(--foreground)] text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-[var(--foreground-secondary)]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

// Research personas data for FlipCarousel
const researchPersonas = [
  {
    tag: "Individual User",
    tagBg: "#DD4825",
    content: "Users automating their own workflows in professional or personal settings. They want to set up automations once and never think about them again.",
    backContent: (
      <PersonaNeeds items={[
        '"Set it and forget it" automation with no babysitting',
        "Manage passwords in one place—no duplicate updates",
        "Quick setup without complex configuration",
      ]} />
    ),
  },
  {
    tag: "Admin",
    tagBg: "#3B82F6",
    content: "Admins automating workflows on behalf of employees. They prioritize security and need controls to enforce safe practices.",
    backContent: (
      <PersonaNeeds items={[
        "Controls to prevent insecure end-user behaviors",
        "Granular control over what agents can access",
        "User-friendly UI for non-technical employees",
      ]} />
    ),
  },
  {
    tag: "Product Builder",
    tagBg: "#10B981",
    content: "Users building Browserbase into their products to automate tasks for customers. They need secure ways to handle customer credentials.",
    backContent: (
      <PersonaNeeds items={[
        "A trusted brand their customers recognize",
        "Use customer credentials without managing them",
        "MFA handling for fully automated flows",
      ]} />
    ),
  },
];

// Problem section card data
const problemItems: FeatureCardItem[] = [
  {
    title: "Security risks",
    description: "Credentials exposed in logs, chat histories, or repositories risk data leaks.",
    bannerBg: "/images/shared/pixel-cloud-blue.png",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
  {
    title: "Productivity loss",
    description: "Manual secret handling slows teams down and diverts focus from building.",
    bannerBg: "/images/shared/pixel-clouds-blue.png",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Adoption barrier",
    description: "Security-conscious teams hesitate to automate without secure credentials.",
    bannerBg: "/images/shared/pixel-cloud-spiral.png",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
  },
];

// Sections for table of contents
const verifierSections = [
  { id: "overview", title: "Overview" },
  { id: "solution", title: "Solution" },
  { id: "usecases", title: "Usecases" },
  { id: "wireframing", title: "Wireframing" },
  { id: "high-fidelity", title: "High-fidelity prototype" },
  { id: "rsa", title: "RSA 2025" },
];

const verifierSliderImages = [
  { src: "/images/work/verifier/slider/verifier-home.png", alt: "Verifier home screen" },
  { src: "/images/work/verifier/slider/profile.png", alt: "Verifier profile screen" },
  { src: "/images/work/verifier/slider/sending.png", alt: "Sending verification request" },
  { src: "/images/work/verifier/slider/sent.png", alt: "Verification request sent" },
  { src: "/images/work/verifier/slider/sent-live-activity.png", alt: "Sent live activity" },
  { src: "/images/work/verifier/slider/received.png", alt: "Verification request received" },
  { src: "/images/work/verifier/slider/confirmed.png", alt: "Verification confirmed" },
  { src: "/images/work/verifier/slider/confirmed-details.png", alt: "Verification confirmed details" },
  { src: "/images/work/verifier/slider/rejected.png", alt: "Verification rejected" },
  { src: "/images/work/verifier/slider/rejected-details.png", alt: "Verification rejected details" },
  { src: "/images/work/verifier/slider/rejected-live-activity.png", alt: "Rejected live activity" },
];

const agenticAutofillSections = [
  { id: "overview", title: "Overview" },
  { id: "the-problem", title: "The Problem" },
  { id: "browser-agents", title: "Browser Agents" },
  { id: "research", title: "Research Insights" },
  { id: "prompt-guidelines", title: "Prompt Guidelines" },
  { id: "impact", title: "Impact" },
  { id: "whats-next", title: "What's Next" },
];

// Agent types card data with examples for flip cards
const agentTypesItems = [
  {
    title: "Conversational agents",
    description: "AI assistants that interact with users through natural language. Users can authorize actions in real-time as needed.",
    bannerBg: "/images/shared/pixel-autumn-driveway.png",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    examples: [
      { name: "ChatGPT", logo: "/images/logos/chatgpt.png" },
      { name: "Claude", logo: "/images/logos/claude.png" },
      { name: "Gemini", logo: "/images/logos/gemini.svg" },
    ],
    useCase: "Ask an AI assistant to check your bank balance or book a flight on your behalf.",
  },
  {
    title: "Autonomous agents",
    description: "Agents that operate independently, running scheduled tasks or responding to triggers without human oversight.",
    bannerBg: "/images/shared/pixel-cloud-spiral-banner.png",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="9" cy="16" r="1" />
        <circle cx="15" cy="16" r="1" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
    examples: [
      { name: "Devin", logo: "/images/logos/devin.png" },
      { name: "AutoGPT", logo: "/images/logos/autogpt.png" },
      { name: "CrewAI", logo: "/images/logos/crewai.png" },
    ],
    useCase: "An AI coding agent that autonomously writes, tests, and deploys code changes.",
  },
  {
    title: "Browser-based agents",
    description: "Agents that navigate the web like humans—clicking, filling forms, and authenticating through traditional login flows.",
    bannerBg: "/images/shared/pixel-fallen-leaves.png",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    examples: [
      { name: "Browserbase", logo: "/images/logos/browserbase.svg" },
      { name: "Playwright", logo: "/images/logos/playwright.svg" },
      { name: "Selenium", logo: "/images/logos/selenium.png" },
    ],
    useCase: "A web scraper that logs into dashboards to extract and aggregate data.",
  },
  {
    title: "API-driven agents",
    description: "Agents that interact programmatically through APIs, using tokens, keys, and secrets that need secure management.",
    bannerBg: "/images/shared/pixel-flower-bed.png",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    examples: [
      { name: "Zapier", logo: "/images/logos/zapier.png" },
      { name: "GitHub Actions", logo: "/images/logos/github-copilot.png" },
      { name: "LangChain", logo: "/images/logos/langchain.png" },
    ],
    useCase: "CI/CD pipelines that deploy to cloud services using API keys and tokens.",
  },
];

// Extracted to its own component so useScroll only runs when mounted
function ScrollScaleVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "center center"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <motion.div
      ref={videoRef}
      className="w-full max-w-[400px] mt-4 overflow-hidden"
      style={{ scale: videoScale }}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto"
      />
    </motion.div>
  );
}

export function VerifierContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <CaseStudyLayout caseStudy={caseStudy} sections={verifierSections}>
      <NarrowContent>
        {/* Overview Section */}
        <ContentSection id="overview" title="Overview">
          <BodyText>
            The 1Password Labs team wanted to explore how 1Password&apos;s verification of trust method and mobile app could be utilised in an employee to employee verification scenario.
          </BodyText>
        </ContentSection>

      </NarrowContent>

      {/* Full-width device SVG */}
      <FullWidthContent className="py-0 !px-0 !md:px-0 max-w-none w-screen relative left-1/2 -translate-x-1/2">
        <div className="relative w-full flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <ImageCarousel
              images={verifierSliderImages}
              cardWidth={338}
              cardHeight={731}
              gap={64}
              snap
              showCaptions={false}
              imageClassName="object-contain"
              className="w-screen"
            />
          </div>
          <div className="relative z-10 scale-[0.9] origin-center">
            <svg width="415" height="852" viewBox="0 0 506 1023" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="498" height="1022.4" transform="translate(3.59998)" fill="black" fillOpacity="0.01" />
              <path d="M400.8 4.34676e-05C413.845 4.32929e-05 425.072 -0.0188523 434.28 0.733442C443.768 1.50866 453.206 3.22077 462.287 7.8477C475.835 14.7505 486.849 25.7651 493.752 39.3125C498.379 48.3936 500.091 57.8311 500.866 67.3194C501.525 75.3763 501.593 84.9793 501.6 95.9932V235.2C503.588 235.2 505.2 236.78 505.2 238.729V349.273C505.2 351.221 503.588 352.8 501.6 352.8V926.007C501.593 937.021 501.525 946.624 500.866 954.681C500.091 964.169 498.379 973.606 493.752 982.688C486.849 996.235 475.835 1007.25 462.287 1014.15C453.206 1018.78 443.768 1020.49 434.28 1021.27C425.072 1022.02 413.845 1022 400.8 1022H104.399C91.3544 1022 80.1269 1022.02 70.9189 1021.27C61.4308 1020.49 51.9931 1018.78 42.9121 1014.15C29.3647 1007.25 18.3501 996.235 11.4473 982.688C6.82028 973.606 5.10823 964.169 4.33301 954.681C3.58069 945.473 3.59961 934.245 3.59961 921.2V378.667C1.61172 378.667 0.000248749 377.078 0 375.117V307.667C0 305.707 1.61156 304.117 3.59961 304.117V285.184C1.6117 285.183 0.000223667 283.594 0 281.634V214.184C0 212.223 1.61156 210.634 3.59961 210.634V178.684C1.6117 178.683 0.000225235 177.094 0 175.134V142C2.41368e-05 140.04 1.61158 138.45 3.59961 138.45V100.8C3.59961 87.7547 3.58068 76.5274 4.33301 67.3194C5.10823 57.8311 6.82026 48.3936 11.4473 39.3125C18.3501 25.7651 29.3647 14.7506 42.9121 7.8477C51.9931 3.22071 61.4308 1.50868 70.9189 0.733442C80.1269 -0.0188769 91.3544 4.28928e-05 104.399 4.34676e-05H400.8ZM104.399 24C77.5173 24 64.0753 23.9998 53.8076 29.2315C44.7762 33.8334 37.4329 41.1766 32.8311 50.2081C27.5994 60.4758 27.5996 73.9176 27.5996 100.8V921.2L27.6006 926.086C27.6197 949.75 27.9265 962.166 32.8311 971.792C37.4329 980.824 44.7762 988.167 53.8076 992.769C64.0753 998 77.5173 998 104.399 998H400.8L405.686 997.999C428.955 997.98 441.348 997.683 450.907 993.01L451.392 992.769C460.141 988.31 467.306 981.279 471.929 972.633L472.368 971.792C477.273 962.166 477.579 949.75 477.599 926.086L477.6 921.2V100.8C477.6 74.3377 477.6 60.8998 472.609 50.6924L472.368 50.2081C467.91 41.4586 460.879 34.2939 452.232 29.6709L451.392 29.2315C441.766 24.327 429.35 24.0202 405.686 24.001L400.8 24H386.281C377.082 24.0001 377.081 29.2622 377.081 34.8086C377.081 45.9353 368.599 60.0293 349.081 60.0293H154.682C135.164 60.0293 126.682 45.9353 126.682 34.4082C126.682 29.2622 126.681 24.0001 117.481 24H104.399Z" fill="black" />
            </svg>
          </div>
        </div>
      </FullWidthContent>

      <NarrowContent>
        {/* Solution Section */}
        <ContentSection id="solution" title="Solution">
          <BodyText>
            We designed a lightweight verification flow that lets employees confirm identity using 1Password&apos;s trusted signals and mobile experience, reducing risk without adding friction.
          </BodyText>
        </ContentSection>

        {/* Hackathon Section */}
        <HackathonSection
          id="hackathon"
          title="Where it all began... a hackathon project"
          profiles={[
            {
              name: "Danny",
              role: "Sr PM",
              image: "/images/work/verifier/danny.jpg",
              icon: "/images/work/verifier/among-us-icon.png",
            },
            {
              name: "Shiner",
              role: "CEO",
              image: "/images/work/verifier/shiner.jpg",
            },
          ]}
          resultImage="/images/work/verifier/deepfake-danny.mp4"
          resultLabel="Deepfake Danny"
          headline="Deepfake scams and AI-based fraud amounted to over $1bn in losses in 2025."
          body="Employees can no longer be certain if the colleague they are interacting with is who they say they are."
          demoVideo="/images/verifier-hackathon-demo.mp4"
        />

        {/* The Problem Section */}
        <ContentSection id="problem" title="From hackathon to labs experiment">
          <BodyText>
            Our CEO at the time – Jeff Shiner – was so inspired by the hackathon project that he greenlit Verifier as a Labs experiment.
          </BodyText>
        </ContentSection>

        {/* Why 1Password Section */}
        <ContentSection id="why-1password" title="Why 1Password?">
          <BodyText>
            1Password is already the trusted source of truth for people&apos;s identities and secrets. Our research has shown that people trust the 1Password brand – even if they&apos;re not a customer. They trust it to keep their secrets safe and secure.
          </BodyText>
        </ContentSection>

        {/* Defining Usecases Section */}
        <ContentSection id="usecases" title="Defining usecases">
          <BodyText className="mb-2">
            Research and workshopping with the team on cybersecurity threats and the problem we&apos;re trying to solve led to focusing on these 4 efforts.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      {/* Sticky Notes Grid (wider) */}
      <WideContent>
        <StickyNotesGrid
          notes={[
            { src: "/images/work/verifier/deepfake-defense-sticky.png", alt: "Deepfake defence" },
            { src: "/images/work/verifier/social-engineering-sticky.png", alt: "Social engineering" },
            { src: "/images/work/verifier/high-value-transactions-sticky.png", alt: "High-value transactions" },
            { src: "/images/work/verifier/trusted-external-support.png", alt: "Trusted external support" },
          ]}
        />
      </WideContent>

      <NarrowContent>
        {/* RSA Challenge Quote */}
        <section className="flex flex-col items-center gap-4 py-8 scroll-mt-8">
          <ZigZagDivider />
          <p className="text-[24px] md:text-[28px] leading-[1.4] tracking-[-0.28px] text-[var(--foreground)] text-center max-w-[640px]">
            &ldquo;It&apos;s 4 weeks until RSA, can you have something built and demo-able by then?&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-10 h-10 overflow-hidden rotate-[-5deg] relative">
              <Image
                src="/images/work/verifier/matt-grimes.jpg"
                alt="Matt Grimes"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[var(--foreground)]">Matt Grimes</span>
              <span className="text-sm text-[var(--foreground)]">Sr. Director, End-User Experience</span>
            </div>
          </div>
          <ZigZagDivider />
          {/* Panic video */}
          <ScrollScaleVideo src="/images/work/verifier/rowoon-panic.mp4" />
        </section>

        {/* Wireframing Section */}
        <ContentSection id="wireframing" title="Wireframing the flow">
          <BodyText className="mb-4">
            Given the tight turnaround, I quickly mocked up wireframes to get alignment from the team and stakeholders on what would be possible for our MVP before transitioning to higher fidelity designs.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      {/* Figma Embed - Wireframes */}
      <div className="mx-auto w-full max-w-[375px] sm:max-w-[400px] aspect-[375/812] overflow-hidden">
        <iframe
          src="https://embed.figma.com/proto/PdTOSzIo5vFiRr2UieT0na/Verifier?page-id=3%3A167191&node-id=3-166829&scaling=scale-down-width&content-scaling=responsive&starting-point-node-id=3%3A166829&embed-host=share"
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>

      <NarrowContent>
        {/* Pivot Statement */}
        <section className="flex flex-col items-center gap-4 py-8 scroll-mt-8">
          <p className="text-[24px] md:text-[28px] leading-[1.4] tracking-[-0.28px] text-[var(--foreground)] text-center max-w-[640px]">
            It turns out... 4 weeks was in fact not enough time to build a working MVP. So, we had to pivot.
          </p>
        </section>

        {/* The Flow Section */}
        <ContentSection id="high-fidelity" title="High fidelity prototype">
          <BodyText className="mb-4">
            I created a high fidelity prototype of the flow to show at our RSA booth to security professionals and potential customers.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      {/* Figma Embed - High Fidelity (full width) */}
      <FullWidthContent className="aspect-[4/3] md:aspect-[16/10] md:min-h-[500px] overflow-hidden">
        <iframe
          src="https://embed.figma.com/proto/PdTOSzIo5vFiRr2UieT0na/Verifier?page-id=0%3A1&node-id=1-37665&scaling=contain&content-scaling=fixed&starting-point-node-id=1%3A37321&embed-host=share"
          className="w-full h-full border-0"
          allowFullScreen
        />
      </FullWidthContent>

      <NarrowContent>
        {/* RSA Section */}
        <ContentSection id="rsa" title="RSA San Francisco 2025">
          <BodyText className="mb-6">
            The demo was well received at RSA, with the use case resonating strongly with CEOs, who are frequent targets of phishing and impersonation attacks. The positive feedback validated continued investment in the project and provided strong momentum for the team.
          </BodyText>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1 aspect-[4/3] overflow-hidden relative">
                <Image
                  src="/images/work/verifier/verifier-rsa-1.jpg"
                  alt="Verifier demo at RSA booth"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 aspect-[4/3] overflow-hidden relative">
                <Image
                  src="/images/work/verifier/verifer-rsa-3.jpg"
                  alt="Verifier prototype on display at RSA"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <QuoteCard
              quote="You're right in my sweet spot. Massive value. You should double down on this."
              attribution="Security Professional at RSA"
            />
            <div className="w-full aspect-[889/684] overflow-hidden relative">
              <Image
                src="/images/work/verifier/verifier-rsa-2.jpg"
                alt="RSA Conference crowd"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </ContentSection>
      </NarrowContent>
    </CaseStudyLayout>
  );
}

export function AgenticAutofillContent({ caseStudy }: { caseStudy: CaseStudy }) {
  const [platformTab, setPlatformTab] = useState<'desktop' | 'mobile'>('desktop');
  
  return (
    <CaseStudyLayout caseStudy={caseStudy} sections={agenticAutofillSections}>
      <NarrowContent>
        <ContentSection id="overview" title="Overview">
          <BodyText>
            As the design lead on this project, I partnered with our PM and engineering team to define and ship a 0→1 product that enables AI agents to securely authenticate on behalf of users—without ever exposing their credentials.
          </BodyText>
          <BodyText>
            The result was 1Password&apos;s first integration purpose-built for agentic AI—launched in partnership with Browserbase and covered by major tech publications including The Verge and TechRadar.
          </BodyText>

          <div className="aspect-video w-full overflow-hidden rounded-lg border border-[var(--border-darker)]">
            <iframe
              src="https://www.youtube.com/embed/c3tqMe2_UwQ"
              title="Introducing 1Password Secure Agentic Autofill for Browserbase"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </ContentSection>
      </NarrowContent>

      <NarrowContent>
        <ZigZagDivider />
      </NarrowContent>

      <NarrowContent>
        <ContentSection id="the-problem">
          <SkewedTag size="xl">The Problem</SkewedTag>

          <BodyText className="text-3xl leading-normal my-3">Users want AI agents to automate tasks for them, but have limited options to grant access without exposing their credentials.</BodyText>

          <BodyText>Users are forced to hand over credentials directly to AI agents in order for them to act on their behalf. This creates inherent risks and vulnerabilities as credentials are exchanged and utilised over insecure channels.</BodyText>

        </ContentSection>
      </NarrowContent>

      {/* Problem cards */}
      <NarrowContent className="mt-6">
        <FeatureCardList items={problemItems} trailingConnector />
      </NarrowContent>

      {/* Interactive Summary Card Demo – variation with different bg and "The problem" label */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 -mt-8">
        <SummaryCardDemo
          variant="agentic-autofill"
          backgroundImage="/images/work/agentic-autofill/problem-solution-bg-6.png"
          backgroundPosition="bottom center"
          headerLabel="The problem"
        />
      </div>

      <NarrowContent className="mt-12">
        <ContentSection title="Types of AI agents">
          <BodyText>
            As AI agents become more capable, they're being deployed in increasingly diverse ways. Understanding these different agent types helped us design a solution that works across the spectrum of use cases.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <NarrowContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {agentTypesItems.map((item, index) => (
            <FlipCard
              key={item.title}
              className="h-[340px]"
              autoFlipHint={index === 0}
              front={
                <CardFace
                  icon={item.icon}
                  title={item.title}
                  bannerBg={item.bannerBg}
                >
                  <p className="text-[var(--foreground)] text-base">
                    {item.description}
                  </p>
                </CardFace>
              }
              back={
                <div className="card-spotlight h-full flex flex-col p-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] leading-tight">Use case</h3>
                    <p className="text-[var(--foreground)] text-base leading-relaxed">{item.useCase}</p>
                  </div>
                  <div className="mt-auto border-t border-[var(--foreground)]/10 pt-4">
                    <div className="flex flex-wrap gap-3">
                      {item.examples.map((example, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Image 
                            src={example.logo} 
                            alt={example.name}
                            width={24}
                            height={24}
                            className="object-contain rounded-md shrink-0"
                          />
                          <span className="text-[var(--foreground)] text-base">{example.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </NarrowContent>

      <NarrowContent>
        <ZigZagDivider />
      </NarrowContent>

      <NarrowContent id="browser-agents" className="scroll-mt-8">
        <SkewedTag size="xl">Browser-based Agents</SkewedTag>
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] leading-tight">
          Browserbase enters the chat.
        </p>

        <BodyText linkColor="neutral">
          1Password partnered with <a href="https://browserbase.com" target="_blank" rel="noopener noreferrer">Browserbase</a> – an AI agent browser platform – to develop an integration for their product <a href="https://director.ai" target="_blank" rel="noopener noreferrer">Director.ai</a> that would allow users to securely provide their credentials to AI agents.
        </BodyText>

        <BodyText linkColor="neutral">
          I created a vision prototype to show Browserbase and internal stakeholders how an integration could work and how it would help both of our customers.
        </BodyText>
      </NarrowContent>

      <FullWidthContent className="mt-12 xl:px-32">
        <div className="relative w-full" style={{ paddingBottom: "62.5%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full border-0"
            src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F2toCLEwSrPnl36bml6x1NL%2FAgentic-Autofill-Case-Study%3Fpage-id%3D1%253A75662%26node-id%3D1-110516%26viewport%3D-2475%252C-312%252C0.25%26t%3D6COyOptz1gcPhdn3-8%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D1%253A110516%26show-proto-sidebar%3D1%26hide-ui%3D1"
            allowFullScreen
          />
        </div>
      </FullWidthContent>

      {/* Research Insights Section */}
      <NarrowContent className="mt-16">
        <ContentSection id="research" title="Research Insights">
          <BodyText>
            We teamed up with the Browserbase team to conduct a research study with 6 of their customers to understand how they are using Browserbase and how they are currently handling credentials when using agentic AI. Three distinct personas emerged from the research:
          </BodyText>
        </ContentSection>
      </NarrowContent>

      {/* User Personas - FlipCarousel style */}
      <FlipCarousel items={researchPersonas} />


      {/* Findings Summary */}
      <NarrowContent className="mt-12">
        <ContentSection title="What we learned">
        <div className="flex flex-col mt-6">
          {[
            {
              num: 1,
              title: "MFA is a major pain point",
              description: "Multi-factor authentication consistently disrupts automation flows for all user types.",
              bannerBg: "/images/shared/pixel-forest-sky.png",
            },
            {
              num: 2,
              title: "Current methods are insecure or complex",
              description: "Users either give plain text passwords to LLMs (insecure) or build complex integrations that are hard to maintain.",
              bannerBg: "/images/shared/pixel-clouds-blue.png",
            },
            {
              num: 3,
              title: "Brand trust matters",
              description: "Users trust well-known security brands like 1Password over lesser-known alternatives.",
              bannerBg: "/images/shared/pixel-field-clouds.png",
            },
          ].map((item, index, arr) => (
            <div key={item.num}>
              <div className="bg-[var(--background)] border border-[var(--foreground)]/20 flex flex-col sm:flex-row overflow-hidden">
                <div className="p-1 sm:self-stretch">
                  <div className="relative py-4 sm:py-0 shrink-0 flex items-center justify-center w-full sm:w-32 sm:h-full sm:min-h-[128px] overflow-hidden">
                    <Image
                      src={item.bannerBg}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-white/35 backdrop-blur-lg" />
                      <div className="relative p-1">
                        <div className="rounded bg-[var(--background)] text-[var(--foreground)] w-12 h-12 flex items-center justify-center">
                          <span className="text-xl font-bold">{item.num}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex-1">
                  <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] leading-tight">{item.title}</h3>
                  <p className="text-[var(--foreground)] text-lg">{item.description}</p>
                </div>
              </div>
              <div className="h-12 flex justify-center py-2">
                <div className="w-0.5 h-full bg-[var(--foreground)]/30" />
              </div>
            </div>
          ))}
        </div>
        </ContentSection>
      </NarrowContent>

      {/* Trust Quote */}
      <NarrowContent className="-mt-6 gap-3">
        <h4 className="text-base uppercase tracking-wider text-[var(--foreground)]/70 font-bold text-center">The tl;dr</h4>
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] leading-normal">
          Individual users will sacrifice <span className="bg-[var(--foreground)]/10 px-1">security for automation</span>. Admins will sacrifice <span className="bg-[var(--foreground)]/10 px-1">automation for security</span>.
        </p>
      </NarrowContent>

      <NarrowContent>
        <ZigZagDivider />
      </NarrowContent>

      {/* Why not MCP Section */}
      <NarrowContent>
        <SkewedTag size="xl">Why not MCP?</SkewedTag>
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] leading-tight">
          MCP wasn't the answer for credentials, so we built our own.
        </p>
        <BodyText>
          MCP servers are designed for general-purpose integrations—not for handling sensitive credentials. Exposing passwords through an MCP server would create a security vulnerability, as credentials could be logged, cached, or accessed by unintended processes. It was a pathway that we ruled out pretty early on.
        </BodyText>
        <BodyText>
          Agentic Autofill takes a different approach. Credentials never leave 1Password&apos;s secure vault. Instead of passing secrets through the model context, 1Password injects credentials directly into the browser at the moment of authentication—keeping them encrypted and invisible to the agent itself.
        </BodyText>
      </NarrowContent>

      <NarrowContent>
        <ZigZagDivider />
      </NarrowContent>

      {/* The Prompt Section */}
      <NarrowContent id="the-prompt" className="scroll-mt-8">
        <SkewedTag size="xl">The Prompt</SkewedTag>
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] leading-tight">
          The 1Password access request.
        </p>
        <BodyText>
          When an AI agent needs to authenticate, 1Password presents the user with a clear authorization request—showing exactly which service is requesting access and which credentials will be used.
        </BodyText>
      </NarrowContent>

      <WideContent>
        {/* Platform Tabs */}
        <div className="mb-6">
          <Tabs
            options={[
              { id: 'desktop', label: 'Desktop' },
              { id: 'mobile', label: 'Mobile' }
            ]}
            defaultTab="desktop"
            onChange={(id) => setPlatformTab(id as 'desktop' | 'mobile')}
          />
        </div>
        
        {/* Desktop: Prompt and callouts - hidden but not unmounted when mobile tab is active */}
        <div className={`flex justify-center py-8 relative ${platformTab !== 'desktop' ? 'hidden' : ''}`}>
          <CyclingPermissionCard showCountdown={false} />
          
          {/* Guideline callout positioned to the left, connecting to platform avatar */}
          <div className="hidden lg:block absolute right-[calc(50%+180px)] top-[95px]">
            <PromptGuidelineCard 
              title="The Requester" 
              description="High visiblity given to the platform or AI agent requesting access to your 1Password item(s)."
              alignRight={true}
              showLabel={true}
              labelText="UX Callout"
            />
          </div>
          
          {/* Guideline callout positioned to the right, upper section */}
          <div className="hidden lg:block absolute left-[calc(50%+190px)] top-[275px]">
            <PromptGuidelineCard 
              title="Choose a different item" 
              description="If the Agent requests the wrong item, the user can choose a different item or remove it."
              alignRight={false}
              showLabel={true}
              labelText="UX Callout"
              delay={2}
            />
          </div>
        </div>
        
        {/* Mobile: Phone frame with content - hidden but not unmounted when desktop tab is active */}
        <div className={`flex justify-center py-8 ${platformTab !== 'mobile' ? 'hidden' : ''}`}>
          <div className="relative">
            {/* Phone frame SVG - larger size */}
            <svg width="375" height="767" viewBox="0 0 506 1023" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
              <rect width="498" height="1022.4" transform="translate(3.59998)" fill="black" fillOpacity="0.01" />
              <path d="M400.8 4.34676e-05C413.845 4.32929e-05 425.072 -0.0188523 434.28 0.733442C443.768 1.50866 453.206 3.22077 462.287 7.8477C475.835 14.7505 486.849 25.7651 493.752 39.3125C498.379 48.3936 500.091 57.8311 500.866 67.3194C501.525 75.3763 501.593 84.9793 501.6 95.9932V235.2C503.588 235.2 505.2 236.78 505.2 238.729V349.273C505.2 351.221 503.588 352.8 501.6 352.8V926.007C501.593 937.021 501.525 946.624 500.866 954.681C500.091 964.169 498.379 973.606 493.752 982.688C486.849 996.235 475.835 1007.25 462.287 1014.15C453.206 1018.78 443.768 1020.49 434.28 1021.27C425.072 1022.02 413.845 1022 400.8 1022H104.399C91.3544 1022 80.1269 1022.02 70.9189 1021.27C61.4308 1020.49 51.9931 1018.78 42.9121 1014.15C29.3647 1007.25 18.3501 996.235 11.4473 982.688C6.82028 973.606 5.10823 964.169 4.33301 954.681C3.58069 945.473 3.59961 934.245 3.59961 921.2V378.667C1.61172 378.667 0.000248749 377.078 0 375.117V307.667C0 305.707 1.61156 304.117 3.59961 304.117V285.184C1.6117 285.183 0.000223667 283.594 0 281.634V214.184C0 212.223 1.61156 210.634 3.59961 210.634V178.684C1.6117 178.683 0.000225235 177.094 0 175.134V142C2.41368e-05 140.04 1.61158 138.45 3.59961 138.45V100.8C3.59961 87.7547 3.58068 76.5274 4.33301 67.3194C5.10823 57.8311 6.82026 48.3936 11.4473 39.3125C18.3501 25.7651 29.3647 14.7506 42.9121 7.8477C51.9931 3.22071 61.4308 1.50868 70.9189 0.733442C80.1269 -0.0188769 91.3544 4.28928e-05 104.399 4.34676e-05H400.8ZM104.399 24C77.5173 24 64.0753 23.9998 53.8076 29.2315C44.7762 33.8334 37.4329 41.1766 32.8311 50.2081C27.5994 60.4758 27.5996 73.9176 27.5996 100.8V921.2L27.6006 926.086C27.6197 949.75 27.9265 962.166 32.8311 971.792C37.4329 980.824 44.7762 988.167 53.8076 992.769C64.0753 998 77.5173 998 104.399 998H400.8L405.686 997.999C428.955 997.98 441.348 997.683 450.907 993.01L451.392 992.769C460.141 988.31 467.306 981.279 471.929 972.633L472.368 971.792C477.273 962.166 477.579 949.75 477.599 926.086L477.6 921.2V100.8C477.6 74.3377 477.6 60.8998 472.609 50.6924L472.368 50.2081C467.91 41.4586 460.879 34.2939 452.232 29.6709L451.392 29.2315C441.766 24.327 429.35 24.0202 405.686 24.001L400.8 24H386.281C377.082 24.0001 377.081 29.2622 377.081 34.8086C377.081 45.9353 368.599 60.0293 349.081 60.0293H154.682C135.164 60.0293 126.682 45.9353 126.682 34.4082C126.682 29.2622 126.681 24.0001 117.481 24H104.399Z" fill="var(--foreground)" />
            </svg>
            {/* Screen content - iOS Bottom Sheet */}
            <div 
              className="absolute overflow-hidden"
              style={{
                top: '2.35%',
                left: '5.5%',
                right: '5.5%',
                bottom: '2.35%',
                borderRadius: '30px',
              }}
            >
              <MobilePermissionCard />
            </div>
          </div>
        </div>
      </WideContent>

      {/* Pros and Cons Section */}
      <NarrowContent className="mt-12">
        <BodyText>There were pros and cons to this approach of displaying a Just in Time Prompt (JITP) to the user via their desktop or mobile device.</BodyText>
        <ContentSection title="Advantages">
          <BodyList>
            <li><strong>Transparency:</strong> Users see exactly which credentials are being requested and by which service</li>
            <li><strong>Trust:</strong> Leverages the trusted 1Password brand that users already rely on for security</li>
            <li><strong>Control:</strong> Granular ability to approve, deny, or modify access on a per-request basis</li>
            <li><strong>Security:</strong> Time-bound access and explicit consent reduce risk of unauthorized use</li>
          </BodyList>
        </ContentSection>
      </NarrowContent>

      <NarrowContent className="mt-8">
        <ContentSection title="Trade-offs">
          <BodyList>
            <li><strong>Interruption:</strong> Breaks automation flow—the very thing users are trying to achieve</li>
            <li><strong>Prompt fatigue:</strong> Frequent requests from the same agent could lead to approval fatigue</li>
            <li><strong>Cognitive load:</strong> Users must evaluate each request, which can be taxing during complex workflows</li>
            <li><strong>Blocking:</strong> Agent workflow pauses until user responds, limiting autonomous operation</li>
          </BodyList>
        </ContentSection>
      </NarrowContent>

      <NarrowContent>
        <ZigZagDivider />
      </NarrowContent>

      {/* Prompt Design Section */}
      <NarrowContent id="prompt-guidelines" className="scroll-mt-8">
        <SkewedTag size="xl">Prompt Design Guidelines</SkewedTag>
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] leading-tight">
          How do you design for something that's non-deterministic?
        </p>
        <BodyText>
          AI agents are inherently unpredictable. A key part of this project was defining guidelines that create predictable, trustworthy behavior when agents handle sensitive credentials—ensuring transparency, minimal access, and user control at every step.
        </BodyText>
      </NarrowContent>

      {/* Prompt Design Chat Demo */}
      <FullWidthContent className="!px-0">
        <SummaryCardDemo
          variant="prompt-design"
          showBackground={false}
        />
      </FullWidthContent>

      <NarrowContent>
        <ZigZagDivider />
      </NarrowContent>

      {/* Impact Section */}
      <NarrowContent id="impact" className="mt-8 scroll-mt-8">
        <ContentSection>
        <SkewedTag size="xl">Impact</SkewedTag>
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] leading-tight mt-4">
        Agentic Autofill was one of 1Password's most visible launches to date.
        </p>
        <BodyText className="mt-4">
          The Secure Agentic Autofill launch with Browserbase generated significant media coverage, positioning 1Password as the trusted security layer for agentic AI.
        </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent>
        <div className="grid grid-cols-2 gap-4 lg:px-28">
          <StatCard value="25+" label="Global stories" />
          <StatCard value="170M+" label="Impressions" />
          <StatCard value="1.26M" label="Estimated views" />
          <StatCard value="64" label="Avg. domain authority" />
        </div>
      </WideContent>

      {/* Full-bleed press coverage section */}
      <motion.div 
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden"
        style={{
          backgroundImage: 'url(/images/work/agentic-autofill/problem-solution-bg-4.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-start justify-center gap-8 md:gap-12 pt-16">
          <motion.div
            variants={{
              hidden: { y: "100%" },
              visible: { y: 16 }
            }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="w-full max-w-[640px]"
          >
            <Image 
              src="/images/work/agentic-autofill/theverge-agentic-autofill-4.png"
              alt="The Verge coverage"
              width={720}
              height={600}
              className="w-full h-auto shadow-[0_25px_60px_-10px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { y: "100%" },
              visible: { y: 16 }
            }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.1 }}
            className="w-full max-w-[640px]"
          >
            <Image 
              src="/images/work/agentic-autofill/siliconangle-agentic-autofill-4.png"
              alt="SiliconANGLE coverage"
              width={720}
              height={600}
              className="w-full h-auto shadow-[0_25px_60px_-10px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>
      </motion.div>

      <NarrowContent className="-mt-24 md:-mt-38 relative z-10">
        <QuoteCard
          quote="It remembers the passwords that you can't, and hides them from AI bots that can't be trusted to forget."
          attribution="The Verge"
        />
      </NarrowContent>

      <NarrowContent className="mt-12">
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] leading-tight">
          Actual usage was low – but that was never the goal.
        </p>
        <BodyText>
          The usage of the 1Password integration with Browserbase was low. That wasn&apos;t surprising or unexpected news for our team given a couple of factors:
        </BodyText>
        <BodyList ordered>
          <li>The user needs to have both a Browserbase and 1Password account.</li>
          <li>The user needs to use the specific Director.ai web interface.</li>
        </BodyList>
        <BodyText>
          So usage was never a success factor for this project. Success was measured on how successful the launch was as a means of publicly positioning 1Password as the trusted security layer for agentic AI, and therefore paving the way for future integrations with other platforms and use cases.
        </BodyText>
      </NarrowContent>

      <NarrowContent className="mt-8">
        <ZigZagDivider />
      </NarrowContent>

      {/* What's Next Section */}
      <NarrowContent id="whats-next" className="scroll-mt-8">
        <SkewedTag size="xl">What&apos;s Next</SkewedTag>
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] leading-tight mt-4">
          From Browser Agents to Autonomous Agents.
        </p>
        <BodyText className="mt-4">
          The Browserbase integration was just the beginning. We&apos;re now exploring how 1Password can securely provide credentials to fully autonomous agents that operate independently—without human oversight or real-time approval flows.
        </BodyText>
        <BodyText>
          This raises new design challenges around trust, delegation, and control. How do you grant an AI agent access to sensitive credentials when there&apos;s no human in the loop? We&apos;re actively researching policy-based access controls, time-bound permissions, and audit trails that give organizations confidence to automate at scale.
        </BodyText>
      </NarrowContent>

      {/* Admin console with sticky notes overlay */}
      <WideContent className="mt-8">
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden shadow-xl border border-[var(--border-darker)]/20">
          <Image
            src="/images/work/agentic-autofill/autonomous-agents-admin-console-4.png"
            alt="Autonomous agents admin console concept"
            width={1600}
            height={900}
            className="w-full h-auto"
          />
          
        </div>
          {/* Sticky notes positioned at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
            <StickyNotesGrid
              notes={[
                { src: "/images/work/agentic-autofill/activity-auditing-sticky.png", alt: "Activity and Auditing" },
                { src: "/images/work/agentic-autofill/item-vault-access-sticky.png", alt: "Item and vault access" },
                { src: "/images/work/agentic-autofill/granular-permissions-sticky.png", alt: "Granular permissions" },
                { src: "/images/work/agentic-autofill/autonomous-agents-sticky.png", alt: "Autonomous agents" },
              ]}
            />
          </div>
        </div>
      </WideContent>
      
      {/* Spacer for sticky notes overflow */}
      <div className="h-24 md:h-32" />

    </CaseStudyLayout>
  );
}
