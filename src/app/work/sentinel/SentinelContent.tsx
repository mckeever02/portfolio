"use client";

import { useState, useRef, useEffect } from "react";
import { CaseStudy } from "@/data/case-studies";
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
import { FlipCarousel } from "@/components/FlipCarousel";
import { MediaCarousel } from "@/components/MediaCarousel";
import { HighlightText } from "@/components/HighlightText";
import { HoverImageText } from "@/components/HoverImageText";
import { ZigZagDivider } from "@/components/ZigZagDivider";
import { SpotlightEffect } from "@/components/SpotlightEffect";
import { TextCarousel, QuoteProgressIndicator } from "@/components/TextCarousel";
import { SummaryCardDemo } from "@/components/SummaryCardDemo";
import { SkewedTag } from "@/components/SkewedTag";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

type StickyNote = { src: string; alt: string; rotation: number; delay: number; position: { top?: string; bottom?: string; left: string; translateX: string; translateY: string } };

// Scroll-scale image component - scales up as user scrolls into view
function ScrollScaleImage({ 
  src, 
  alt,
  aspectRatio = "16/9",
  maxWidth = "1000px",
}: { 
  src: string; 
  alt: string;
  aspectRatio?: string;
  maxWidth?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  return (
    <motion.div
      ref={containerRef}
      className="mx-auto w-full"
      style={{ scale, maxWidth }}
    >
      <div 
        className="relative rounded-lg overflow-hidden border border-black/10"
        style={{ aspectRatio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`(max-width: 768px) 100vw, ${maxWidth}`}
        />
      </div>
    </motion.div>
  );
}

// Comic slide component for Sonja's story carousel
type CaptionPosition = "top-center" | "bottom-center" | "bottom-right" | "bottom-left" | "top-left" | "top-right" | "center" | "center-left";

const captionPositionClasses: Record<CaptionPosition, string> = {
  "top-center": "absolute -top-10 left-1/2 -translate-x-1/2",
  "bottom-center": "absolute -bottom-6 left-1/2 -translate-x-1/2",
  "bottom-right": "absolute -bottom-6 right-6",
  "bottom-left": "absolute -bottom-6 left-6",
  "top-left": "absolute -top-10 left-6",
  "top-right": "absolute -top-10 right-6",
  "center": "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "center-left": "absolute top-1/2 left-6 -translate-y-1/2",
};

function ComicCaption({ 
  caption, 
  position, 
  isActive 
}: { 
  caption: string; 
  position: CaptionPosition; 
  isActive: boolean;
}) {
  return (
    <motion.div 
      className={`${captionPositionClasses[position]} bg-[#FFFDE7] border-2 border-black px-3 py-2 md:px-4 md:py-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10`}
      style={{ fontFamily: "'Anime Ace', sans-serif" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isActive ? 1 : 0, 
        scale: isActive ? 1 : 0.8 
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: isActive ? 0.3 : 0
      }}
    >
      <p className="text-black text-xs md:text-sm uppercase leading-snug text-center max-w-[200px] md:max-w-[280px]">
        {caption}
      </p>
    </motion.div>
  );
}

function ComicSlide({ 
  children, 
  caption,
  captionPosition = "top-center",
  isActive = false 
}: { 
  children: React.ReactNode; 
  caption?: string;
  captionPosition?: CaptionPosition;
  isActive?: boolean;
}) {
  return (
    <div className="bg-white/20 backdrop-blur-xl p-3 border border-white/30 rounded-xl relative">
      <div className="relative">
        {children}
        {/* Light grey overlay for inactive slides */}
        <motion.div
          className="absolute inset-0 bg-gray-200 pointer-events-none rounded-lg"
          animate={{ opacity: isActive ? 0 : 0.5 }}
          transition={{ duration: 0.4 }}
        />
      </div>
      {caption && (
        <ComicCaption caption={caption} position={captionPosition} isActive={isActive} />
      )}
    </div>
  );
}

// Video slide that only loads when active
function ComicVideoSlide({ 
  src,
  caption,
  captionPosition = "top-center",
  isActive = false 
}: { 
  src: string;
  caption?: string;
  captionPosition?: CaptionPosition;
  isActive?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Derive poster path from video src (e.g., sonja-story-2.mp4 -> sonja-story-2-poster.jpg)
  const posterSrc = src.replace('.mp4', '-poster.jpg');

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  return (
    <div className="bg-white/20 backdrop-blur-xl p-3 border border-white/30 rounded-xl relative">
      <div className="relative">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          poster={posterSrc}
          preload={isActive ? "auto" : "none"}
          className="w-full rounded-lg"
        >
          <source src={src} type="video/mp4" />
        </video>
        {/* Light grey overlay for inactive slides */}
        <motion.div
          className="absolute inset-0 bg-gray-200 pointer-events-none rounded-lg"
          animate={{ opacity: isActive ? 0 : 0.5 }}
          transition={{ duration: 0.4 }}
        />
      </div>
      {caption && (
        <ComicCaption caption={caption} position={captionPosition} isActive={isActive} />
      )}
    </div>
  );
}

function QuoteCard({ children, attribution }: { children: React.ReactNode; attribution: string }) {
  return (
    <div className="bg-[var(--background)] border p-8 md:p-10 border-[var(--foreground)]/20 relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-48 h-48 bg-[#A99BEA]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10">
        <svg className="w-8 h-8 text-[var(--foreground)]/40 mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-[var(--foreground)] text-xl md:text-2xl leading-relaxed mb-6">
          {children}
        </p>
        <p className="text-[var(--foreground)]/60 uppercase font-bold tracking-wider text-sm">
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

// Competitive analysis data
const competitors = [
  { name: "Okta", domain: "okta.com", genAI: true, conversational: true, predictive: true, personalisation: true, agentic: false },
  { name: "CrowdStrike", domain: "crowdstrike.com", genAI: true, conversational: true, predictive: true, personalisation: true, agentic: true },
  { name: "Atlassian", domain: "atlassian.com", genAI: true, conversational: true, predictive: "partial", personalisation: true, agentic: true },
  { name: "HubSpot", domain: "hubspot.com", genAI: true, conversational: true, predictive: false, personalisation: true, agentic: true },
  { name: "Monday.com", domain: "monday.com", genAI: true, conversational: true, predictive: "partial", personalisation: true, agentic: false },
  { name: "Notion", domain: "notion.so", genAI: true, conversational: true, predictive: false, personalisation: true, agentic: true },
  { name: "Zoho", domain: "zoho.com", genAI: true, conversational: true, predictive: true, personalisation: true, agentic: true },
  { name: "Google Workspace", domain: "workspace.google.com", genAI: true, conversational: true, predictive: "partial", personalisation: true, agentic: false },
  { name: "Salesforce", domain: "salesforce.com", genAI: true, conversational: true, predictive: true, personalisation: true, agentic: true },
  { name: "1Password", domain: "1password.com", genAI: false, conversational: false, predictive: false, personalisation: false, agentic: false, highlight: true },
];

function StatusIcon({ status }: { status: boolean | "partial" }) {
  if (status === true) {
    return (
      <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  }
  if (status === false) {
    return (
      <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  }
  // partial - horizontal line (dash) icon
  return (
    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function CompetitorTable() {
  const columns = [
    { key: "genAI", label: "Generative AI" },
    { key: "conversational", label: "Conversational UI" },
    { key: "predictive", label: "Predictive insights" },
    { key: "personalisation", label: "Personalisation" },
    { key: "agentic", label: "Agentic systems" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--foreground)]/20">
            <th className="py-4 px-4"></th>
            {columns.map((col) => (
              <th key={col.key} className="py-4 px-3 font-bold text-sm uppercase tracking-wider text-[var(--foreground)]/60 text-center">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {competitors.map((company, idx) => (
            <tr 
              key={company.name}
              className={`border-b border-[var(--foreground)]/10 last:border-b-0 transition-colors ${
                company.highlight 
                  ? "bg-[var(--foreground)]/5" 
                  : idx % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--foreground)]/[0.02]"
              }`}
            >
              <td className={`py-4 px-4 ${company.highlight ? "font-bold text-[var(--foreground)]" : "text-[var(--foreground)]/80"}`}>
                <div className="flex items-center gap-3">
                  <Image
                    src={`https://img.logo.dev/${company.domain}?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ`}
                    alt={`${company.name} logo`}
                    width={20}
                    height={20}
                    className="rounded-sm"
                    unoptimized
                  />
                  {company.name}
                </div>
              </td>
              {columns.map((col) => (
                <td key={col.key} className="py-4 px-3 text-center">
                  <div className="flex justify-center">
                    <StatusIcon status={company[col.key as keyof typeof company] as boolean | "partial"} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const adminReasons = [
  {
    title: "People management",
    description: "Onboard new team members, manage permissions, handle account recovery, and maintain organizational structure.",
    bannerBg: "/images/work/sentinel/people-management-bg.png",
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
    bannerBg: "/images/work/sentinel/security-management-bg.png",
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
    bannerBg: "/images/work/sentinel/security-insights-bg.png",
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

// Order of auto-cycling: 1. insights, 2. tasks, 3. support
const FOCUS_ORDER: NonNullable<ImageFocus>[] = ["insights", "support", "tasks"];

function SolutionSection() {
  const [imageFocus, setImageFocus] = useState<ImageFocus>(null);
  const [isManualHover, setIsManualHover] = useState(false);
  const [autoCycleIndex, setAutoCycleIndex] = useState(0);
  const [progress, setProgress] = useState(100);
  const [phase, setPhase] = useState<"waiting" | "expanding" | "paused" | "shrinking">("waiting");
  const [expandProgress, setExpandProgress] = useState(0); // 0 to 100 for expansion
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const INITIAL_DELAY = 3000; // 3 second delay before cycle starts
  const EXPAND_DURATION = 500; // 0.5 seconds for expansion
  const PAUSE_DURATION = 1200; // 1.2 second pause at top before shrinking
  const SHRINK_DURATION = 5500; // 5.5 seconds for the shrink animation
  const TICK_INTERVAL = 16; // ~60fps for smooth animation
  
  // Spring-like overshoot easing for expansion
  const easeOutBack = (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
  
  // Track when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.5);
        });
      },
      { threshold: 0.5 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Initial waiting phase (3s delay before starting)
  useEffect(() => {
    if (isManualHover || !isInView || phase !== "waiting") return;
    
    const timeout = setTimeout(() => {
      setPhase("expanding");
    }, INITIAL_DELAY);
    
    return () => clearTimeout(timeout);
  }, [phase, isManualHover, isInView]);
  
  // Expansion phase
  useEffect(() => {
    if (isManualHover || !isInView || phase !== "expanding") return;
    
    const tickAmount = (TICK_INTERVAL / EXPAND_DURATION) * 100;
    
    const interval = setInterval(() => {
      setExpandProgress((prev) => {
        const next = prev + tickAmount;
        if (next >= 100) {
          setPhase("paused");
          return 100;
        }
        return next;
      });
    }, TICK_INTERVAL);
    
    return () => clearInterval(interval);
  }, [phase, isManualHover, isInView]);
  
  // Pause phase
  useEffect(() => {
    if (isManualHover || !isInView || phase !== "paused") return;
    
    const timeout = setTimeout(() => {
      setPhase("shrinking");
    }, PAUSE_DURATION);
    
    return () => clearTimeout(timeout);
  }, [phase, isManualHover, isInView]);
  
  // Shrinking phase
  useEffect(() => {
    if (isManualHover || !isInView || phase !== "shrinking") return;
    
    const tickAmount = (TICK_INTERVAL / SHRINK_DURATION) * 100;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - tickAmount;
        if (next <= 0) {
          // Move to next highlight
          setAutoCycleIndex((prevIndex) => (prevIndex + 1) % FOCUS_ORDER.length);
          setPhase("expanding");
          setExpandProgress(0);
          return 100;
        }
        return next;
      });
    }, TICK_INTERVAL);
    
    return () => clearInterval(interval);
  }, [phase, isManualHover, isInView]);
  
  // Determine the active focus (manual hover takes priority, null during waiting)
  const activeFocus = isManualHover ? imageFocus : (phase === "waiting" ? null : FOCUS_ORDER[autoCycleIndex]);
  
  // Calculate the visual progress based on current phase
  const getVisualProgress = () => {
    if (phase === "waiting") {
      return 0; // No highlight during initial delay
    } else if (phase === "expanding") {
      // Animate from 0 to 100 with spring easing
      return easeOutBack(expandProgress / 100) * 100;
    } else if (phase === "paused") {
      return 100; // Full height during pause
    } else {
      // Shrinking - linear countdown
      return progress;
    }
  };
  
  const visualProgress = getVisualProgress();
  
  // Handle manual hover - pause auto cycle
  const handleMouseEnter = (focus: ImageFocus) => {
    setIsManualHover(true);
    setImageFocus(focus);
  };
  
  const handleMouseLeave = () => {
    setIsManualHover(false);
    setImageFocus(null);
    // Reset to expanding phase when leaving hover
    setProgress(100);
    setExpandProgress(0);
    setPhase("expanding");
  };

  return (
    <FullWidthContent className="mt-0">
      <div 
        ref={sectionRef}
        className="grid grid-cols-1 bg-[var(--background)] border border-[var(--foreground)]/20 lg:grid-cols-2 items-center"
      >
        <div className="p-6 xs:p-8 sm:p-12">
          <section id="exploration" className="flex flex-col gap-4 xs:gap-5 sm:gap-6 scroll-mt-8">
            <SkewedTag as="h3" className="text-lg lg:text-xl">The solution</SkewedTag>
            <p className="text-[var(--foreground)] text-2xl md:text-3xl lg:text-4xl leading-relaxed">
              An AI Agent which can{" "}
              <HighlightText
                color="blue"
                onMouseEnter={() => handleMouseEnter("insights")}
                onMouseLeave={handleMouseLeave}
                isActive={activeFocus === "insights"}
                progress={!isManualHover && activeFocus === "insights" ? visualProgress : undefined}
              >
                generate insights
              </HighlightText>
              ,{" "}
              <HighlightText
                color="purple"
                onMouseEnter={() => handleMouseEnter("tasks")}
                onMouseLeave={handleMouseLeave}
                isActive={activeFocus === "tasks"}
                progress={!isManualHover && activeFocus === "tasks" ? visualProgress : undefined}
              >
                automate tasks
              </HighlightText>{" "}
              and{" "}
              <HighlightText
                color="brown"
                onMouseEnter={() => handleMouseEnter("support")}
                onMouseLeave={handleMouseLeave}
                isActive={activeFocus === "support"}
                progress={!isManualHover && activeFocus === "support" ? visualProgress : undefined}
              >
                provide support
              </HighlightText>
              .
            </p>
          </section>
        </div>

        <div 
          className="p-6 pl-0 overflow-hidden relative"
          style={{
              backgroundImage: "url('/images/work/sentinel/preview-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
            <motion.div 
              className="relative w-full aspect-[2760/3045] overflow-hidden rounded-lg rounded-l-none shadow-2xl border border-[var(--foreground)]/10 border-l-0"
              initial={{ x: "-75%", opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2
              }}
            >
              <Image
                src="/images/work/sentinel/sentinel-tasks-cropped.png"
                alt="Sentinel AI task automation interface"
                fill
                className="object-cover transition-transform duration-700 ease-out"
                style={{
                  transform: activeFocus ? imageTransforms[activeFocus] : "scale(1) translate(0%, 0%)",
                }}
              />
            </motion.div>
            
            {/* Sticky notes that pop in on hover */}
            <AnimatePresence mode="popLayout">
              {activeFocus && stickyNotes[activeFocus].map((sticky, index) => (
                <motion.div
                  key={`${activeFocus}-${index}`}
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
    </FullWidthContent>
  );
}

const insights = [
  {
    tag: "Unclear data",
    tagBg: "#190C69",
    highlightBg: "rgba(169, 155, 234, 0.25)",
    spotlightColor: "rgba(169, 155, 234, 0.25)",
    content: (
      <>
        Admins need faster, clearer answers to their data questions. Current insights and reports lack depth and clarity.
      </>
    ),
    quote: {
      text: (<>I don&apos;t have time to dig through a bunch of separate reports. I just need a <span className="bg-[#A99BEA]/30 py-0.5" style={{ boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>clear answer to simple questions</span> like &apos;Are we safer than last quarter?&apos; without spending half my day in dashboards.</>),
      attribution: "IT Manager at a Mid-market SaaS company",
    },
  },
  {
    tag: "Hard labour",
    tagBg: "#611046",
    highlightBg: "rgba(249, 218, 239, 0.4)",
    spotlightColor: "rgba(249, 218, 239, 0.4)",
    content: (
      <>
        Manual work like account recovery and user management overloads admins. They want more efficient methods such as automation.
      </>
    ),
    quote: {
      text: (<>What I am looking for is <span className="bg-[#F9DAEF]/50 py-0.5" style={{ boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>automation.</span> The automation piece means your life is going to get easier. Do this and there&apos;s less work for you.</>),
      attribution: "InfoSec Manager at an SMB",
    },
  },
];

const hesitations = [
  {
    tag: "Breach fatigue",
    tagBg: "#92400E",
    content: (
      <>
        A pervasive sense that security incidents are inevitable, making admins wary of introducing new technologies that could expand their attack surface.
      </>
    ),
    quote: {
      text: "It just seems like [a breach] can happen to anybody and it's kind of bound to happen at some point. So, it just feels like it's somewhat inevitable that you can't avoid it.",
      attribution: "Systems Engineer at a Mid-sized company",
    },
  },
  {
    tag: "AI as surveillance",
    tagBg: "#581C87",
    content: (
      <>
        Deep discomfort with AI accessing sensitive credential data—the feeling that introducing AI means &ldquo;another set of eyes&rdquo; can read private information.
      </>
    ),
    quote: {
      text: "Introducing AI in that area where I put my password for my email would make me feel like there is another set of eyes there that can read the data.",
      attribution: "IT Engineer at an SMB",
    },
  },
];

// Timeline card data
const timelineItems = [
  {
    title: "Composable blocks",
    description: "Small, reusable UI components that can be combined in different ways to present information, actions, and feedback.",
        bannerBg: "/images/work/sentinel/composable-blocks-bg.png",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    title: "Sentinel decides",
    description: "1Password Sentinel determines which components to render based on the user's query and the type of response needed.",
    bannerBg: "/images/work/sentinel/sentinel-decides-bg.png",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    ),
  },
  {
    title: "Flexible rendering",
    description: "Components adapt to show tables, charts, action buttons, or confirmation dialogs depending on the task at hand.",
      bannerBg: "/images/work/sentinel/flexible-rendering-bg-2.png",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

function TimelineCard({ item }: { item: typeof timelineItems[0] }) {
  return (
    <div className="bg-[var(--background)] border border-[var(--foreground)]/20 flex flex-col sm:flex-row overflow-hidden">
        <div className="p-1">
            <div 
                className="relative py-4 sm:py-0 sm:aspect-square shrink-0 flex items-center justify-center w-full sm:w-32"
                style={{
                backgroundImage: `url('${item.bannerBg}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                }}
            >
                <div className="rounded-lg bg-white/30 backdrop-blur-sm p-1">
                <div className="rounded bg-[var(--background)] text-[var(--foreground)] w-12 h-12 flex items-center justify-center">
                    {item.icon}
                </div>
                </div>
            </div>
        </div>
      <div className="p-4 sm:p-6 flex-1">
        <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] leading-tight">{item.title}</h3>
        <p className="text-[var(--foreground)] text-lg">{item.description}</p>
      </div>
    </div>
  );
}

function TimelineConnector() {
  return (
    <div className="h-12 flex justify-center py-2">
      <div className="w-0.5 h-full bg-[var(--foreground)]/30" />
    </div>
  );
}

function AgenticTimeline() {
  return (
    <div className="flex flex-col">
      {timelineItems.map((item) => (
        <div key={item.title}>
          <TimelineCard item={item} />
          <TimelineConnector />
        </div>
      ))}
    </div>
  );
}

export function SentinelContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <CaseStudyLayout caseStudy={caseStudy}>
      <NarrowContent>
        <ContentSection id="overview" title="Overview">
          <BodyText>
            Sentinel was a vision project exploring how an AI-powered copilot could help 1Password administrators manage their organizations more efficiently. Through research, prototyping, and internal advocacy, I worked to demonstrate how conversational AI could simplify complex administrative tasks, surface actionable insights, and reduce the cognitive load of managing enterprise security at scale.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent>
        <ScrollScaleImage
        src="/images/work/sentinel/sentinel.jpg"
        alt="Sentinel AI-powered admin copilot"
        maxWidth="1000px"
        aspectRatio="2880/1768"
      />
      </WideContent>

      {/* Making a case for Agentic AI */}
      <NarrowContent className="mt-16">
        <ContentSection id="making-the-case" title="Making a case for Agentic AI in 1Password">
          <BodyText>
            As AI capabilities rapidly evolved across the industry, 1Password risked falling behind competitors who were already shipping AI-powered features. I conducted{" "}
            <HoverImageText
              images={[
                {
                  src: "/images/work/sentinel/comparative-audit-preview.png",
                  alt: "Comparative audit preview",
                  width: 1000,
                  height: 490,
                  offset: { x: -350, y: 200 },
                  rotation: -1,
                },
              ]}
            >a comparative analysis</HoverImageText>{" "}
            to understand where the market was heading and identify the opportunity for 1Password to differentiate.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent className="mt-0">
        <div className="bg-[var(--background)] border border-[var(--foreground)]/20 overflow-hidden">
          <CompetitorTable />
        </div>
        <p className="text-[var(--foreground)]/60 text-center mt-4 text-sm">
          Competitive landscape analysis of AI capabilities across B2B SaaS platforms (Q3 2025)
        </p>
      </WideContent>

      <NarrowContent className="mt-8">
        <BodyText>
            The case I made to leadership was simple—we needed to catch up, and fast. Falling behind wasn&apos;t just a competitive issue—it was an existential one.
        </BodyText>

        <QuoteCard attribution="Buzz Woeckener – 1Password Customer Advisory Board">
            AI is the next competitive advantage — we want to automate the simple things so we can humanize the difficult things.
        </QuoteCard>
      </NarrowContent>


      <NarrowContent className="mt-16">
        <ContentSection id="why-admins" title="Understanding our Admin pain points">
          <BodyText>
            Understanding admin motivations and their pain points helped me identify where AI features might be most valuable.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adminReasons.map((reason, index) => (
            <FlipCard
              key={reason.title}
              className="h-[340px]"
              autoFlipHint={index === 0}
              front={
                <CardFace
                  icon={reason.icon}
                  title={reason.title}
                  bannerBg={reason.bannerBg}
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

      {/* Key Insights Carousel */}
      <FlipCarousel items={insights} />

      {/* Line connector */}
      <div className="flex justify-center">
        <div className="w-0.5 h-16 bg-[var(--foreground)]/20" />
        </div>

      <SolutionSection />

      {/* Proof of Concept Section */}
      <NarrowContent className="mt-16">
        <ContentSection id="proof-of-concept" title="Vibe-coding a proof of concept">
          <BodyText>
            To help validate the idea and demonstrate the potential capabilities, I vibe-coded a proof of concept to share with stakeholders and the AI team.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent className="mt-0">
        <div className="relative w-full overflow-hidden border border-[var(--foreground)]/20">
          <video
            src="/images/work/sentinel/xam-assistant-concept.mp4"
            poster="/images/work/sentinel/xam-assistant-concept-poster.jpg"
            controls
            playsInline
            preload="none"
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
            className="object-contain dark:hidden"
          />
          <Image
            src="/images/work/sentinel/sentinel-concept-diagram-dark.png"
            alt="Sentinel concept diagram"
            fill
            className="object-contain hidden dark:block"
          />
        </div>
      </NarrowContent>

      {/* Agentic-driven UI Section */}
      <NarrowContent className="mt-16">
        <ContentSection id="agentic-ui" title="Agentic-driven UI">
          <BodyText>
            A key challenge was designing UI that could adapt to unpredictable AI responses. Rather than creating fixed layouts, I developed a system of modular building block components that the agent could dynamically compose based on context.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <NarrowContent className="mt-0">
        <AgenticTimeline />
      </NarrowContent>

      {/* Interactive Summary Card Demo */}
      <FullWidthContent className="-mt-8">
        <SummaryCardDemo />
      </FullWidthContent>


        <ZigZagDivider />

      {/* User Testing Section */}
      <NarrowContent>
        <ContentSection id="user-testing" title="User testing">
          <BodyText>
            I partnered with a researcher to run a study to validate the concept and get insights into how organisation's are using AI internally to help them manage their security.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      {/* Full Width Quote Section */}
      <WideContent>
          <div className="relative w-full flex items-center justify-center p-3 sm:p-6 md:px-16 md:py-24 overflow-hidden">
            {/* Background image - optimized by Next.js */}
            <Image
              src="/images/work/sentinel/quote-bg-5.png"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
            {/* Outer frosted glass wrapper */}
            <div className="relative z-10 bg-white/20 backdrop-blur-xl rounded-2xl p-2 max-w-2xl w-full border border-white/30">
              {/* Inner container */}
              <div className="bg-[var(--background)] rounded-xl p-8 md:p-10 h-[280px] flex flex-col">
              <TextCarousel
                items={[
                  { quote: "I like this as a concept. It feels familiar as well. I can give this to my team and they'll just know what to do with minimal instruction.", attribution: "Rafi · Snyk" },
                  { quote: "It feels like you have a teammate. You don't have to think of everything yourself. Yeah, it's cool. It's cool. I like that.", attribution: "Seb · IntentHQ" },
                  { quote: "I'm very excited about 'Run tasks'. That's an extra resource that I have working for me now.", attribution: "Seb · IntentHQ" },
                  { quote: "Yeah, it's fantastic – seeing the list of actions that you have there, these are perfect examples of what people want to explore.", attribution: "Tibor · OpenTable" },
                ]}
                autoplay
                loop
                interval={6000}
                  className="w-full flex-1 flex items-start"
                renderIndicator={(progress) => (
                    <div className="flex justify-center mb-6">
                      <QuoteProgressIndicator progress={progress} />
                  </div>
                )}
              />
          </div>
            </div>
          </div>
      </WideContent>

      {/* AI Hesitations Section */}
      <NarrowContent className="mt-16">
        <ContentSection id="ai-hesitations" title="AI Hesitations?">
          <BodyText>
            During the research we also asked candidates questions around their hesitations and concerns about AI to get a sense of where AI could be a friction point for admins and end-users.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <FlipCarousel items={hesitations} />

      <ZigZagDivider />

      {/* Prototype Story Section */}
      <NarrowContent>
        <ContentSection id="prototype" title="Telling Sonja's story">
          <BodyText>
            To bring the vision to life and build alignment across stakeholders, I created a high-fidelity prototype that followed <HoverImageText
              highlightColor="neutral"
              images={[
                {
                  src: "/images/work/sentinel/sonja-front.png",
                  alt: "Sonja persona card front",
                  width: 202,
                  height: 269,
                  offset: { x: -110, y: -20 },
                  rotation: -5,
                },
                {
                  src: "/images/work/sentinel/sonja-back.png",
                  alt: "Sonja persona card back",
                  width: 202,
                  height: 269,
                  offset: { x: 80, y: 25 },
                  rotation: 4,
                },
              ]}
            >Sonja—our B2B admin persona</HoverImageText>—through a day-in-the-life scenario of a security administrator trying to solve a security incident.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      {/* Sonja Story Carousel - outside width wrappers like FlipCarousel */}
      <div className="relative w-full py-16 overflow-hidden">
        {/* Background image - optimized by Next.js */}
        <Image
          src="/images/work/sentinel/sonja-story-bg.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <MediaCarousel cardWidth={1000} gap={48} className="relative z-10">
          {/* Slide 1: Comic intro */}
          <ComicSlide>
            <Image
              src="/images/work/sentinel/sonja-comic-start.jpg"
              alt="Sonja's day-in-the-life comic introduction"
              width={1040}
              height={567}
              className="w-full rounded-lg"
            />
          </ComicSlide>
          {/* Slide 2 */}
          <ComicVideoSlide 
            src="/images/work/sentinel/sonja-story-2.mp4"
            caption="Sonja decices to turn to Sentinel to investigate the alert."
            captionPosition="top-center"
          />
          {/* Slide 3 */}
          <ComicVideoSlide 
            src="/images/work/sentinel/sonja-story-3.mp4"
            caption="She first investigates who has access to Netsuite"
            captionPosition="bottom-center"
          />
          {/* Slide 4 */}
          <ComicVideoSlide 
            src="/images/work/sentinel/sonja-story-4.mp4"
            caption="Looks like many people have access to Netsuite. She investigates further."
            captionPosition="bottom-right"
          />
          {/* Slide 5 */}
          <ComicVideoSlide 
            src="/images/work/sentinel/sonja-story-5.mp4"
            caption="Damn! The password for Netsuite is being used elsewhere. Time to check who created the login."
            captionPosition="center"
          />
          {/* Slide 6 */}
          <ComicVideoSlide 
            src="/images/work/sentinel/sonja-story-6.mp4"
            caption="Aha! Sonja has found the leak. Now to plug it!"
            captionPosition="center-left"
          />
          {/* Slide 7 */}
          <ComicVideoSlide 
            src="/images/work/sentinel/sonja-story-7.mp4"
            caption="Sonja gets Sentinel to help Emma with rotating the password. The leak is plugged!"
            captionPosition="top-center"
          />
          {/* Slide 8: Final comic */}
          <ComicSlide caption="Crisis averted. Back to her coffee." captionPosition="top-center">
            <Image
              src="/images/work/sentinel/sonja-comic-final.jpg"
              alt="Sonja's story conclusion"
              width={1040}
              height={567}
              className="w-full rounded-lg"
            />
          </ComicSlide>
        </MediaCarousel>
        </div>

        <ZigZagDivider />

        <div className="flex flex-col items-center justify-center gap-8">
          <FlipCard
            className="w-full max-w-md aspect-square"
            front={
              <div className="w-full h-full bg-[var(--background)] flex items-center justify-center p-8 border border-[var(--foreground)]">
                <h2 className="text-4xl md:text-5xl font-normal text-[var(--foreground)] text-center">
                  Did it ship?
                </h2>
              </div>
            }
            back={
              <div className="w-full h-full bg-[var(--foreground)] flex items-center justify-center overflow-hidden border border-[var(--foreground)]">
                <video
                  src="/images/work/sentinel/no.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            }
            autoFlipHint
          />
          <NarrowContent>
            <BodyText>
              Despite strong internal and external signals that an agentic AI system like Sentinel within the 1Password admin console would be a valuable undertaking, the AI team was ultimately repurposed and Sentinel was paused to focus on external AI security efforts.
            </BodyText>
            <BodyText>
              Still, I'm proud of the work that went into crafting and selling this vision. As the underlying technology matures and becomes more secure and easier to integrate, I'm confident something like Sentinel will find its way into the product in the future.
            </BodyText>
          </NarrowContent>
        </div>
    </CaseStudyLayout>
  );
}
