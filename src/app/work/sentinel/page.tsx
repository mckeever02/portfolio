"use client";

import { useState } from "react";
import { getCaseStudy } from "@/data/case-studies";
import {
  CaseStudyLayout,
  NarrowContent,
  WideContent,
  FullWidthContent,
  ContentSection,
  BodyText,
} from "@/components/case-study";
import { LightboxImage } from "@/components/Lightbox";
import Image from "next/image";
import { FlipCard, CardFace } from "@/components/FlipCard";
import { SpotlightEffect } from "@/components/SpotlightEffect";
import { TextCarousel, QuoteProgressIndicator } from "@/components/TextCarousel";
import { SummaryCardDemo } from "@/components/SummaryCardDemo";
import { motion, AnimatePresence } from "framer-motion";

type StickyNote = { src: string; alt: string; rotation: number; delay: number; position: { top?: string; bottom?: string; left: string; translateX: string; translateY: string } };

function QuoteCard({ children, attribution }: { children: React.ReactNode; attribution: string }) {
  return (
    <div className="bg-white border p-8 md:p-10 border-black/20 relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-48 h-48 bg-[#A99BEA]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10">
        <svg className="w-8 h-8 text-black/20 mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-[var(--foreground)] text-xl md:text-2xl leading-relaxed mb-6">
          {children}
        </p>
        <p className="text-black/60 uppercase font-bold tracking-wider text-sm">
          {attribution}
        </p>
      </div>
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="bg-[#e8e4df] px-1 -skew-x-6 inline-block transform">{children}</span>;
}

const stickyNotes: Record<string, StickyNote[]> = {
  insights: [
    { src: "/images/work/sentinel/generate-insights-sticky.png", alt: "Generate insights", rotation: -4, delay: 0, position: { bottom: "2%", left: "50%", translateX: "-50%", translateY: "0%" } },
  ],
  tasks: [
    { src: "/images/work/sentinel/automate-tasks-sticky.png", alt: "Automate tasks", rotation: 3, delay: 0, position: { top: "5%", left: "50%", translateX: "-50%", translateY: "0%" } },
  ],
  support: [
    { src: "/images/work/sentinel/support-sticky.png", alt: "Provide support", rotation: -2, delay: 0, position: { top: "30%", left: "25%", translateX: "-50%", translateY: "-50%" } },
    { src: "/images/work/sentinel/support-sticky-2.png", alt: "Provide support 2", rotation: 3, delay: 0.35, position: { top: "35%", left: "75%", translateX: "-50%", translateY: "-50%" } },
  ],
};

const adminReasons = [
  {
    title: "People management",
    description: "Onboard new team members, manage permissions, handle account recovery, and maintain organizational structure.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    painPoints: [
      "People recovery is time-intensive",
      "Vault and group management can be complex",
    ],
  },
  {
    title: "Security management",
    description: "Configure security policies, enforce compliance standards, and manage authentication requirements across the organization.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    painPoints: [
      "Policies feel confusing with no clear insight of what enforcing a policy will affect",
      "Setting up idPs is time-consuming and complicated",
    ],
  },
  {
    title: "Security insights",
    description: "Monitor password health, identify vulnerabilities, track breach alerts, and gain visibility into organizational security posture.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h5" />
        <path d="M17 12h5" />
        <path d="M12 2v5" />
        <path d="M12 17v5" />
        <circle cx="12" cy="12" r="4" />
        <path d="m4.93 4.93 2.83 2.83" />
        <path d="m16.24 16.24 2.83 2.83" />
        <path d="m4.93 19.07 2.83-2.83" />
        <path d="m16.24 7.76 2.83-2.83" />
      </svg>
    ),
    painPoints: [
      "Difficult to get answers to specific identity and access related questions",
      "Lack of flexibility and granularity with reports",
    ],
  },
];

const WarningIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(239, 68, 68)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

type ImageFocus = "insights" | "tasks" | "support" | null;

const imageTransforms: Record<NonNullable<ImageFocus>, string> = {
  insights: "scale(2) translate(-25%, 10%)",
  tasks: "scale(2) translate(-25%, -5%)",
  support: "scale(2) translate(-25%, -15%)",
};

function SolutionSection() {
  const [imageFocus, setImageFocus] = useState<ImageFocus>(null);

  return (
    <FullWidthContent className="mt-0">
      <div className="md:px-12">
      <div className="grid grid-cols-1 bg-white border border-black/20 lg:grid-cols-2 items-center">
        <div className="p-12">
          <section id="exploration" className="flex flex-col gap-6 scroll-mt-8">
            <span className="font-bold tracking-wide py-1 px-2 uppercase -skew-x-8 transform inline-block w-fit bg-[#e8e4df] text-black">The solution</span>
            <p className="text-[var(--foreground)] text-2xl md:text-3xl lg:text-4xl leading-relaxed">
              An AI Agent which can{" "}
              <span
                className="highlight-expand highlight-expand-blue"
                onMouseEnter={() => setImageFocus("insights")}
                onMouseLeave={() => setImageFocus(null)}
              >
                generate insights
              </span>
              ,{" "}
              <span
                className="highlight-expand highlight-expand-purple"
                onMouseEnter={() => setImageFocus("tasks")}
                onMouseLeave={() => setImageFocus(null)}
              >
                automate tasks
              </span>{" "}
              and{" "}
              <span
                className="highlight-expand highlight-expand-brown"
                onMouseEnter={() => setImageFocus("support")}
                onMouseLeave={() => setImageFocus(null)}
              >
                provide support
              </span>
              .
            </p>
          </section>
        </div>

        <div className="mesh-gradient p-6 pl-0 overflow-hidden relative">
            <div className="relative w-full aspect-[2760/3045] overflow-hidden rounded-lg rounded-l-none shadow-2xl border border-black/10 border-l-0">
            <Image
                src="/images/work/sentinel/sentinel-tasks-cropped.png"
                alt="Sentinel AI task automation interface"
                fill
                className="object-cover transition-transform duration-700 ease-out"
                style={{
                transform: imageFocus ? imageTransforms[imageFocus] : "scale(1) translate(0%, 0%)",
                }}
            />
            </div>
            
            {/* Sticky notes that pop in on hover */}
            <AnimatePresence mode="popLayout">
              {imageFocus && stickyNotes[imageFocus].map((sticky, index) => (
                <motion.div
                  key={`${imageFocus}-${index}`}
                  className="absolute w-[40%] aspect-square pointer-events-none"
                  style={{
                    top: sticky.position.top,
                    bottom: sticky.position.bottom,
                    left: sticky.position.left,
                  }}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.7, 
                    x: sticky.position.translateX, 
                    y: sticky.position.translateY, 
                    rotate: -8 
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: sticky.position.translateX, 
                    y: sticky.position.translateY, 
                    rotate: sticky.rotation,
                    transition: {
                      duration: 0.3,
                      delay: 0.5 + sticky.delay,
                      ease: [0.175, 0.885, 0.32, 1.275],
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.7, 
                    x: sticky.position.translateX, 
                    y: sticky.position.translateY, 
                    rotate: -8,
                    transition: {
                      duration: 0.15,
                      delay: 0,
                      ease: "easeOut",
                    }
                  }}
                >
                  <Image
                    src={sticky.src}
                    alt={sticky.alt}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
        </div>
      </div>
      </div>
    </FullWidthContent>
  );
}

export default function SentinelPage() {
  const caseStudy = getCaseStudy("sentinel");

  if (!caseStudy) {
    return null;
  }

  return (
    <CaseStudyLayout caseStudy={caseStudy}>
      <NarrowContent>
        <ContentSection id="overview" title="Overview">
          <BodyText>
            Sentinel is an AI-powered admin copilot designed to help 1Password administrators manage their organization more efficiently. The project explores how conversational AI can simplify complex administrative tasks, surface insights, and reduce the cognitive load of managing enterprise security at scale.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <LightboxImage
        src="/images/sentinel.jpg"
        alt="Sentinel AI-powered admin copilot"
        maxWidth="1000px"
        aspectRatio="2880/1768"
      />

      <NarrowContent className="mt-16">
        <ContentSection id="why-admins" title="Why do Admins go to the Admin console?">
          <BodyText>
            Understanding admin motivations and their pain points helped me identify where an AI copilot could provide the most value.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adminReasons.map((reason) => (
            <FlipCard
              key={reason.title}
              className="h-[280px]"
              front={
                <CardFace
                  icon={reason.icon}
                  title={reason.title}
                >
                  <p className="text-[var(--foreground)] text-lg">
                    {reason.description}
                  </p>
                </CardFace>
              }
              back={
                <CardFace
                  icon={WarningIcon}
                  iconClassName="bg-red-500/10"
                  title="Pain points"
                >
                  <ul className="list-disc list-outside pl-5 space-y-2">
                    {reason.painPoints.map((point, index) => (
                      <li key={index} className="text-[var(--foreground)] text-base">
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardFace>
              }
            />
          ))}
        </div>
        <p className=" text-[var(--foreground)]/70 text-center mt-4">
          Findings based on moderated interviews with B2B admins for 1Password Teams and Business accounts.
        </p>
      </WideContent>

      <NarrowContent className="mt-16">
        <ContentSection id="insights" title="Key insights">
          <BodyText>
            I identified and shared two key insights from the research to get buy-in from Product and create a shared understanding of the problem.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <FullWidthContent className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:px-12">
          <SpotlightEffect 
            className="bg-white p-10 md:p-12 border border-black/20"
            spotlightColor="rgba(169, 155, 234, 0.25)"
          >
            <span className="text-[var(--foreground)] font-bold tracking-wide bg-[#190C69] text-white py-1 px-2 font-bold uppercase -skew-x-8 transform relative inline-block">Unclear data</span>
            <p className="text-[var(--foreground)] text-2xl md:text-3xl mt-6 leading-relaxed relative z-10">
              Admins need faster, clearer answers to their <span className="bg-[#A99BEA]/25 px-1 -skew-x-6 inline-block transform">data questions</span>. Current insights and reports <span className="bg-[#A99BEA]/25 px-1 -skew-x-6 inline-block transform">lack depth and clarity</span>.
            </p>
          </SpotlightEffect>
          <SpotlightEffect 
            className="bg-white p-10 md:p-12 border border-black/20"
            spotlightColor="rgba(249, 218, 239, 0.4)"
          >
            <span className="text-[var(--foreground)] font-bold tracking-wide bg-[#611046] text-white py-1 px-2 font-bold uppercase -skew-x-8 transform relative inline-block">Hard labour</span>
            <p className="text-[var(--foreground)] text-2xl md:text-3xl mt-6 leading-relaxed relative z-10">
              Manual work like account recovery and user management <span className="bg-[#F9DAEF]/40 px-1 -skew-x-6 inline-block transform">overloads admins</span>. They want more efficient methods such as <span className="bg-[#F9DAEF]/40 px-1 -skew-x-6 inline-block transform">automation</span>.
            </p>
          </SpotlightEffect>
        </div>
      </FullWidthContent>

      {/* Quote Section */}
      <FullWidthContent className="mt-0 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
          <QuoteCard attribution="IT Manager at a Mid-market SaaS company">
            We&apos;re meant to be an AI first company going forward. They would like it to <Highlight>enhance our day-to-day</Highlight>, take out the chaff, remove the thing. They&apos;re not looking to replace people and everything else.
          </QuoteCard>
          <QuoteCard attribution="InfoSec Manager at an SMB">
            What I am looking for is <Highlight>automation.</Highlight> <br />The automation piece means your life is going to get easier. Do this and there&apos;s less work for you.
          </QuoteCard>
        </div>
      </FullWidthContent>

      <SolutionSection />

      <WideContent className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Concept 1: Contextual Assistant */}
          <div className="group relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A99BEA]/20 rounded-full blur-3xl transform translate-x-8 -translate-y-8 group-hover:bg-[#A99BEA]/30 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#A99BEA]/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A99BEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#A99BEA]">Concept A</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Contextual assistant</h3>
              <p className="text-white/70 text-sm mb-4">AI appears contextually based on the current page and detected user intent.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Low friction entry
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Context-aware suggestions
                </div>
                <div className="flex items-center gap-2 text-xs text-red-400/70">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  May feel intrusive
                </div>
              </div>
            </div>
          </div>

          {/* Concept 2: Command Palette */}
          <div className="group relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9DAEF]/20 rounded-full blur-3xl transform translate-x-8 -translate-y-8 group-hover:bg-[#F9DAEF]/30 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#F9DAEF]/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F9DAEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#F9DAEF]">Concept B</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Command palette</h3>
              <p className="text-white/70 text-sm mb-4">Power-user focused interface triggered by keyboard shortcut for quick actions.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Fast for power users
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Non-intrusive
                </div>
                <div className="flex items-center gap-2 text-xs text-red-400/70">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Hidden discoverability
                </div>
              </div>
            </div>
          </div>

          {/* Concept 3: Conversational Panel */}
          <div className="group relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 border border-[#10B981]/30 overflow-hidden ring-2 ring-[#10B981]/20">
            <div className="absolute top-3 right-3 px-2 py-1 bg-[#10B981]/20 rounded text-[10px] font-mono uppercase tracking-wider text-[#10B981]">
              Selected
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/20 rounded-full blur-3xl transform translate-x-8 -translate-y-8 group-hover:bg-[#10B981]/30 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#10B981]">Concept C</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Conversational panel</h3>
              <p className="text-white/70 text-sm mb-4">Persistent chat panel allowing natural dialogue with the AI assistant.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Natural interaction
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Supports complex queries
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Easy to discover
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[var(--foreground)]/70 text-center mt-6">
          The conversational panel emerged as the strongest concept—balancing discoverability with power.
        </p>
      </WideContent>

      <NarrowContent className="mt-16">
        <ContentSection id="benefits" title="What benefits do Admins see when adding AI to 1Password?">
          <BodyText>
            Through discussions with admins and stakeholders, I identified the key benefits that an AI copilot could bring to the admin experience.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <NarrowContent className="mt-0 max-w-xl">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-3 border border-black/20 flex flex-row gap-4">
            <div 
              className="h-48 w-48 flex flex-row items-center justify-center bg-black/5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(16, 185, 129)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4" />
                <path d="m16.2 7.8 2.9-2.9" />
                <path d="M18 12h4" />
                <path d="m16.2 16.2 2.9 2.9" />
                <path d="M12 18v4" />
                <path d="m4.9 19.1 2.9-2.9" />
                <path d="M2 12h4" />
                <path d="m4.9 4.9 2.9 2.9" />
              </svg>
            </div>
            <div className="flex flex-col py-4">
                <h3 className="text-xl font-bold mb-4 text-[var(--foreground)] leading-tight">Automating tasks</h3>
                <p className="text-[var(--foreground)] text-xl">Save time and effort by automating repetitive administrative workflows.</p>
            </div>
          </div>
          <div className="card-spotlight">
            <div 
              className="rounded-lg flex items-center justify-center mb-4 shrink-0 bg-blue-500/10"
              style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(59, 130, 246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] leading-tight">Actionable insights</h3>
            <p className="text-[var(--foreground)] text-lg">Help customers spot risks and opportunities quickly with clear, actionable recommendations.</p>
          </div>
          <div className="card-spotlight">
            <div 
              className="rounded-lg flex items-center justify-center mb-4 shrink-0 bg-purple-500/10"
              style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(168, 85, 247)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] leading-tight">Natural language</h3>
            <p className="text-[var(--foreground)] text-lg">Enable users to accomplish tasks without having to learn complex interfaces.</p>
          </div>
        </div>
      </NarrowContent>

      {/* Proof of Concept Section */}
      <NarrowContent className="mt-16">
        <ContentSection id="proof-of-concept" title="Building a proof of concept">
          <BodyText>
            I vibe-coded a proof of concept to help validate the idea and demonstrate the potential capabilities.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent className="mt-0">
        <div className="relative w-full overflow-hidden border border-black/20">
          <video
            src="/images/work/sentinel/xam-assistant-concept.mp4"
            controls
            playsInline
            className="w-full h-auto"
          />
        </div>
      </WideContent>

      <NarrowContent className="mt-8">
        <div className="relative w-full max-w-[800px] mx-auto" style={{ aspectRatio: '2178/1962' }}>
          <Image
            src="/images/work/sentinel/sentinel-concept-diagram.png"
            alt="Sentinel concept diagram"
            fill
            className="object-contain"
          />
        </div>
      </NarrowContent>

      {/* Zig-zag divider */}
      <div className="flex justify-center py-16">
        <svg
          className="w-24 h-3"
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
      </div>

      {/* User Testing Section */}
      <NarrowContent>
        <ContentSection id="user-testing" title="User testing">
          <BodyText>
            To validate our designs and ensure the AI assistant met real user needs, we conducted moderated usability testing sessions with administrators from various organization sizes.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      {/* Full Width Quote Section */}
      <FullWidthContent className="mt-0">
          <div 
            className="relative w-full min-h-[650px] flex items-center justify-center py-20"
            style={{
              backgroundImage: "url('/images/work/sentinel/quote-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
              {/* Quote indicator - absolutely positioned at top center */}
              <div className="w-full px-8 md:px-16 lg:px-24 max-w-4xl">
                <TextCarousel
                  items={[
                    { quote: "I like this as a concept. It feels familiar as well. A lot of companies are doing it this way so that's a good thing. It means I can give this to my team and they'll just know what to do with minimal instruction.", attribution: "Rafi · Snyk" },
                    { quote: "It feels like you have a teammate. You don't have to think of everything yourself. Yeah, it's cool. It's cool. I like that.", attribution: "Seb · IntentHQ" },
                    { quote: "I'm very excited about 'Run tasks'. That's an extra resource that I have working for me now.", attribution: "Seb · IntentHQ" },
                    { quote: "Yeah, it's fantastic – seeing the list of actions that you have there, these are perfect examples of what people want to explore.", attribution: "Tibor · OpenTable" },
                  ]}
                  autoplay
                  loop
                  interval={6000}
                  className="max-w-3xl"
                  renderIndicator={(progress) => (
                    <div className="absolute top-24 left-1/2 -translate-x-1/2">
                      <QuoteProgressIndicator progress={progress} />
                    </div>
                  )}
                />
              </div>
          </div>
      </FullWidthContent>

      {/* AI Hesitations Section */}
      <NarrowContent className="mt-16">
        <ContentSection id="ai-hesitations" title="AI Hesitations?">
          <BodyText>
            Of course it's not all sunshine and rainbows. During the research we also asked candidates questions around their hesitations and concerns about AI to get a sense of where AI could be a friction point for admins.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 border border-black/20">
            <div 
              className="rounded-lg flex items-center justify-center mb-4 shrink-0 bg-red-500/10"
              style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(239, 68, 68)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--foreground)] leading-tight">Trust & accuracy</h3>
            <p className="text-[var(--foreground)]/70 text-base">Concerns about AI making mistakes or providing incorrect information in security-critical contexts.</p>
          </div>
          <div className="bg-white p-6 border border-black/20">
            <div 
              className="rounded-lg flex items-center justify-center mb-4 shrink-0 bg-amber-500/10"
              style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(245, 158, 11)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--foreground)] leading-tight">Control & oversight</h3>
            <p className="text-[var(--foreground)]/70 text-base">Need to maintain visibility and approval over AI-initiated actions, especially for sensitive operations.</p>
          </div>
          <div className="bg-white p-6 border border-black/20">
            <div 
              className="rounded-lg flex items-center justify-center mb-4 shrink-0 bg-purple-500/10"
              style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(168, 85, 247)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--foreground)] leading-tight">Data privacy</h3>
            <p className="text-[var(--foreground)]/70 text-base">Questions about how AI accesses and processes sensitive organizational data.</p>
          </div>
        </div>
      </WideContent>

      <FullWidthContent className="mt-0 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuoteCard attribution="Systems Engineer at a Mid-sized company">
            It just seems like [a breach] can happen to anybody and it&apos;s kind of bound to happen at some point. So, it just feels like it&apos;s somewhat inevitable that you can&apos;t avoid it.
          </QuoteCard>
          <QuoteCard attribution="IT Engineer at an SMB">
            Introducing AI in that area where I put my password for my email would make me feel like there is another set of eyes there that can read the data.
          </QuoteCard>
        </div>
      </FullWidthContent>

      {/* Agentic-driven UI Section */}
      <NarrowContent className="mt-16">
        <ContentSection id="agentic-ui" title="Agentic-driven UI">
          <BodyText>
            A key challenge was designing UI that could adapt to unpredictable AI responses. Rather than creating fixed layouts, I developed a system of modular building block components that the agent could dynamically compose based on context.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 border border-black/20">
            <div 
              className="rounded-lg flex items-center justify-center mb-4 shrink-0 bg-blue-500/10"
              style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(59, 130, 246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--foreground)] leading-tight">Composable blocks</h3>
            <p className="text-[var(--foreground)]/70 text-base">Small, reusable UI components that can be combined in different ways to present information, actions, and feedback.</p>
          </div>
          <div className="bg-white p-6 border border-black/20">
            <div 
              className="rounded-lg flex items-center justify-center mb-4 shrink-0 bg-emerald-500/10"
              style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(16, 185, 129)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6" />
                <path d="M12 17v6" />
                <path d="M4.22 4.22l4.24 4.24" />
                <path d="M15.54 15.54l4.24 4.24" />
                <path d="M1 12h6" />
                <path d="M17 12h6" />
                <path d="M4.22 19.78l4.24-4.24" />
                <path d="M15.54 8.46l4.24-4.24" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--foreground)] leading-tight">Agent decides</h3>
            <p className="text-[var(--foreground)]/70 text-base">The AI agent determines which components to render based on the user&apos;s query and the type of response needed.</p>
          </div>
          <div className="bg-white p-6 border border-black/20">
            <div 
              className="rounded-lg flex items-center justify-center mb-4 shrink-0 bg-purple-500/10"
              style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(168, 85, 247)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--foreground)] leading-tight">Flexible rendering</h3>
            <p className="text-[var(--foreground)]/70 text-base">Components adapt to show tables, charts, action buttons, or confirmation dialogs depending on the task at hand.</p>
          </div>
        </div>
      </WideContent>

      {/* Interactive Summary Card Demo */}
      <FullWidthContent className="mt-8">
        <SummaryCardDemo />
      </FullWidthContent>
    </CaseStudyLayout>
  );
}
