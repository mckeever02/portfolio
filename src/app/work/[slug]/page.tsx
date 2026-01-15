"use client";

import { notFound } from "next/navigation";
import { use, useRef } from "react";
import { getCaseStudy } from "@/data/case-studies";
import {
  BackButton,
  HeroImage,
  ProjectMeta,
  ContentSection,
  QuoteCard,
  HackathonSection,
  BodyText,
  StickyNotesGrid,
} from "@/components/case-study";
import { PageTransition } from "@/components";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CaseStudyPage({ params }: PageProps) {
  const { slug } = use(params);
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  // Scroll-based video scaling
  const videoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "center center"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--background)]">
      <div className="p-4 md:p-8">
        {/* Main Content */}
        <main className="flex flex-col gap-10 py-4 min-w-0">
          {/* Back Button */}
          <div className="mx-auto w-full max-w-[800px]">
            <BackButton />
          </div>
          {/* Hero + Content Wrapper */}
          <div className="flex flex-col">
            {/* Hero Image */}
            <div className="mx-auto w-full max-w-[1000px]">
              <HeroImage bgColor={caseStudy.heroColor} imageSrc={caseStudy.heroImage} />
            </div>

            {/* Content Container */}
            <div className="mx-auto w-full max-w-[800px] flex flex-col gap-10 md:-mt-[120px] relative z-10">
            {/* Project Metadata */}
            <ProjectMeta
              subtitle={caseStudy.subtitle}
              timeline={caseStudy.timeline}
              role={caseStudy.role}
              team={caseStudy.team}
            />

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
            resultImage="/images/work/verifier/deepfake-danny.gif"
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
          </div>
          {/* Sticky Notes Grid (wider) */}
          <div className="mx-auto w-full max-w-[1000px]">
            <StickyNotesGrid
              notes={[
                { src: "/images/work/verifier/deepfake-defense-sticky.png", alt: "Deepfake defence" },
                { src: "/images/work/verifier/social-engineering-sticky.png", alt: "Social engineering" },
                { src: "/images/work/verifier/high-value-transactions-sticky.png", alt: "High-value transactions" },
                { src: "/images/work/verifier/trusted-external-support.png", alt: "Trusted external support" },
              ]}
            />
          </div>
          <div className="mx-auto w-full max-w-[800px] flex flex-col gap-10">

          {/* RSA Challenge Quote */}
          <section className="flex flex-col items-center gap-4 py-8 scroll-mt-8">
            {/* Zig-zag divider */}
            <svg
              className="w-24 h-3 mb-4"
              viewBox="0 0 96 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6L8 11L16 6L24 11L32 6L40 11L48 6L56 11L64 6L72 11L80 6L88 11L96 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--foreground)]/30"
              />
            </svg>
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
                <div className="absolute inset-0 bg-[var(--background)] mix-blend-multiply" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[var(--foreground)]">Matt Grimes</span>
                <span className="text-sm text-[var(--foreground)]">Sr. Director, End-User Experience</span>
              </div>
            </div>
            {/* Zig-zag divider */}
            <svg
              className="w-24 h-3 mt-4"
              viewBox="0 0 96 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6L8 11L16 6L24 11L32 6L40 11L48 6L56 11L64 6L72 11L80 6L88 11L96 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--foreground)]/30"
              />
            </svg>
            {/* Panic video */}
            <motion.div
              ref={videoRef}
              className="w-full max-w-[400px] mt-4 rounded overflow-hidden"
              style={{ scale: videoScale }}
            >
              <video
                src="/images/work/verifier/rowoon-panic.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto"
              />
            </motion.div>
          </section>

          {/* Wireframing Section */}
          <ContentSection id="wireframing" title="Wireframing the flow">
            <BodyText className="mb-4">
              Given the tight turnaround, I quickly mocked up wireframes to get alignment from the team and stakeholders on what would be possible for our MVP before transitioning to higher fidelity designs.
            </BodyText>
          </ContentSection>
          </div>
          {/* Figma Embed - Wireframes (wider) */}
          <div className="mx-auto w-full max-w-[375px] sm:max-w-[400px] aspect-[375/812] rounded overflow-hidden mb-10">
            <iframe
              src="https://embed.figma.com/proto/PdTOSzIo5vFiRr2UieT0na/Verifier?page-id=3%3A167191&node-id=3-166829&scaling=scale-down-width&content-scaling=responsive&starting-point-node-id=3%3A166829&embed-host=share"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
          <div className="mx-auto w-full max-w-[800px] flex flex-col gap-10">

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
          </div>
          {/* Figma Embed - High Fidelity (full width) */}
          <div className="w-full aspect-[4/3] md:aspect-[16/10] md:min-h-[500px] rounded overflow-hidden mb-10">
            <iframe
              src="https://embed.figma.com/proto/PdTOSzIo5vFiRr2UieT0na/Verifier?page-id=0%3A1&node-id=1-37665&scaling=contain&content-scaling=fixed&starting-point-node-id=1%3A37321&embed-host=share"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
          <div className="mx-auto w-full max-w-[800px] flex flex-col gap-10">

          {/* RSA Section */}
          <ContentSection id="rsa" title="RSA San Francisco 2025">
            <BodyText className="mb-6">
                The demo was well received at RSA, with the use case resonating strongly with CEOs, who are frequent targets of phishing and impersonation attacks. The positive feedback validated continued investment in the project and provided strong momentum for the team.
            </BodyText>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1 aspect-[4/3] rounded overflow-hidden relative">
                  <Image
                    src="/images/work/verifier/verifier-rsa-1.jpg"
                    alt="Verifier demo at RSA booth"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 aspect-[4/3] rounded overflow-hidden relative">
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
              <div className="w-full aspect-[889/684] rounded overflow-hidden relative">
                <Image
                  src="/images/work/verifier/verifier-rsa-2.jpg"
                  alt="RSA Conference crowd"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </ContentSection>

            {/* Bottom spacer */}
            <div className="h-[200px]" />
            </div>
          </div>
        </main>
      </div>
    </div>
    </PageTransition>
  );
}
