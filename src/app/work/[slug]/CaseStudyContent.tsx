"use client";

import { useRef } from "react";
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
  StickyNotesGrid,
  FeatureCardList,
  StatCard,
} from "@/components/case-study";
import type { FeatureCardItem } from "@/components/case-study";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ZigZagDivider } from "@/components/ZigZagDivider";
import { SummaryCardDemo } from "@/components/SummaryCardDemo";
import { FlipCard, CardFace } from "@/components/FlipCard";
import { FlipCarousel } from "@/components/FlipCarousel";
import { SkewedTag } from "@/components/SkewedTag";

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
    <CaseStudyLayout caseStudy={caseStudy}>
      <NarrowContent>
        {/* Overview Section */}
        <ContentSection id="overview" title="Overview">
          <BodyText>
            The 1Password Labs team wanted to explore how 1Password&apos;s verification of trust method and mobile app could be utilised in an employee to employee verification scenario.
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
        <ContentSection id="flow" title="High fidelity prototype">
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
  return (
    <CaseStudyLayout caseStudy={caseStudy}>
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
                          <img 
                            src={example.logo} 
                            alt={example.name}
                            className="w-6 h-6 object-contain rounded-md shrink-0"
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

      <NarrowContent>
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
          MCP isn&apos;t the answer for credentials – agentic autofill is.
        </p>
        <BodyText>
          MCP servers are designed for general-purpose integrations—not for handling sensitive credentials. Exposing passwords through an MCP server would create a security vulnerability, as credentials could be logged, cached, or accessed by unintended processes. Not ideal.
        </BodyText>
        <BodyText>
          Agentic Autofill takes a different approach. Credentials never leave 1Password&apos;s secure vault. Instead of passing secrets through the model context, 1Password injects credentials directly into the browser at the moment of authentication—keeping them encrypted and invisible to the agent itself.
        </BodyText>
      </NarrowContent>

      <NarrowContent>
        <ZigZagDivider />
      </NarrowContent>

      {/* Prompt Design Section */}
      <NarrowContent>
        <SkewedTag size="xl">Prompt Design Guidelines</SkewedTag>
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] leading-tight">
          How do you design for something you can&apos;t control?
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

      {/* Autonomous Agents Section */}
      <NarrowContent className="mt-8">
        <SkewedTag size="xl">Autonomous Agents</SkewedTag>
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] leading-tight mt-4">
          Coming soon.
        </p>
        <BodyText className="mt-4">
          We are exploring how 1Password can securely provide credentials to autonomous agents that operate independently without human oversight.
        </BodyText>
      </NarrowContent>

      <NarrowContent>
        <ZigZagDivider />
      </NarrowContent>

      {/* Impact Section */}
      <NarrowContent className="mt-8">
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
          backgroundImage: "url('/images/work/agentic-autofill/problem-solution-bg-4.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
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

      <NarrowContent>
        <QuoteCard
          quote="It remembers the passwords that you can't, and hides them from AI bots that can't be trusted to forget."
          attribution="The Verge"
        />
      </NarrowContent>

    </CaseStudyLayout>
  );
}
