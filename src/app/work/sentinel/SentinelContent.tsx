"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CaseStudy } from "@/data/case-studies";
import {
  CaseStudyLayout,
  NarrowContent,
  WideContent,
  FullWidthContent,
  ContentSection,
  BodyText,
  LargeText,
} from "@/components/case-study";
import { LightboxImage } from "@/components/Lightbox";
import Image from "next/image";
import { FlipCard, CardFace } from "@/components/FlipCard";
import { FlipCarousel } from "@/components/FlipCarousel";
import { MediaCarousel } from "@/components/MediaCarousel";
import { HighlightText } from "@/components/HighlightText";
import { HoverImageText } from "@/components/HoverImageText";
import { ZigZagDivider } from "@/components/ZigZagDivider";
import { TextCarousel, QuoteProgressIndicator } from "@/components/TextCarousel";
import { SummaryCardDemo } from "@/components/SummaryCardDemo";
import { SkewedTag } from "@/components/SkewedTag";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";

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

  // Parse maxWidth to get numeric value for sizes calculation
  const maxWidthNum = parseInt(maxWidth, 10) || 1000;

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
          sizes={`(max-width: 768px) 100vw, ${maxWidthNum}px`}
          quality={90}
          priority
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
    <div className="rounded-lg border border-black/5 overflow-hidden">
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
    <div className="relative">
      <div className="relative">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          poster={posterSrc}
          preload={isActive ? "auto" : "none"}
          className="w-full rounded-lg bg-black/20 border border-black/5 overflow-hidden"
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
  { name: "Okta", logo: "/images/logos/okta.png", genAI: true, conversational: true, predictive: true, personalisation: true, agentic: false },
  { name: "CrowdStrike", logo: "/images/logos/crowdstrike.png", genAI: true, conversational: true, predictive: true, personalisation: true, agentic: true },
  { name: "Atlassian", logo: "/images/logos/atlassian.png", genAI: true, conversational: true, predictive: "partial", personalisation: true, agentic: true },
  { name: "HubSpot", logo: "/images/logos/hubspot.png", genAI: true, conversational: true, predictive: false, personalisation: true, agentic: true },
  { name: "Monday.com", logo: "/images/logos/monday.png", genAI: true, conversational: true, predictive: "partial", personalisation: true, agentic: false },
  { name: "Notion", logo: "/images/logos/notion.png", genAI: true, conversational: true, predictive: false, personalisation: true, agentic: true },
  { name: "Zoho", logo: "/images/logos/zoho.png", genAI: true, conversational: true, predictive: true, personalisation: true, agentic: true },
  { name: "Google Workspace", logo: "/images/logos/google-workspace.png", genAI: true, conversational: true, predictive: "partial", personalisation: true, agentic: false },
  { name: "Salesforce", logo: "/images/logos/salesforce.png", genAI: true, conversational: true, predictive: true, personalisation: true, agentic: true },
  { name: "1Password", logo: "/images/logos/1password.png", genAI: false, conversational: false, predictive: false, personalisation: false, agentic: false, highlight: true },
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
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={20}
                    height={20}
                    className="rounded-sm"
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
    bannerBg: "/images/shared/pixel-meadow-flowers.png",
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
    bannerBg: "/images/shared/pixel-sky-through-trees.png",
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
    bannerBg: "/images/shared/pixel-field-clouds.png",
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

type ListItem = {
  name: string;
  type: string;
  icon: string;
};

type SearchUseCase = {
  query: string;
  response: string;
  results: { name: string; logo: string }[];
  items?: ListItem[];
};

const searchUseCases: SearchUseCase[] = [
  {
    query: "What's my login for taxes?",
    response: "Here's your login for the company tax portal.",
    results: [{ name: "Xero", logo: "/images/logos/xero.svg" }],
  },
  {
    query: "Where do I book time off?",
    response: "You can request time off through Personio.",
    results: [{ name: "Personio", logo: "/images/logos/personio.svg" }],
  },
  {
    query: "Stuff for onboarding",
    response: "Found 5 relevant items for onboarding preparation.",
    results: [
      { name: "Google Workspace", logo: "/images/logos/google-workspace.svg" },
      { name: "Slack", logo: "/images/logos/slack.svg" },
      { name: "Notion", logo: "/images/logos/notion.svg" },
    ],
    items: [
      { name: "HR Onboarding Checklist", type: "Secure Note", icon: "/images/logos/secure-note.png" },
      { name: "Employee Handbook Document", type: "Document", icon: "/images/logos/document-file.png" },
    ],
  },
  {
    query: "What do I need for travel?",
    response: "Found 4 relevant items for travel preparation.",
    results: [
      { name: "Navan", logo: "/images/logos/navan.png" },
    ],
    items: [
      { name: "Travel Passport", type: "Passport", icon: "/images/logos/passport.png" },
      { name: "Corporate Airline Loyalty Program", type: "Reward Program", icon: "/images/logos/rewards.png" },
      { name: "Sales Travel Amex", type: "Credit Card", icon: "/images/logos/credit-card-amex.png" },
    ],
  },
  {
    query: "Do I have access to the finance dashboard?",
    response: "Yes — you have viewer access to the finance dashboard.",
    results: [{ name: "QuickBooks", logo: "/images/logos/quickbooks.svg" }],
  },
  {
    query: "What's the app to use for expenses?",
    response: "Expensify is your company's expense management tool.",
    results: [{ name: "Expensify", logo: "/images/logos/expensify.svg" }],
  },
];

type DropdownState =
  | { phase: "hidden" }
  | { phase: "thinking"; resultCount: number; itemCount: number }
  | { phase: "responding"; response: string; results: SearchUseCase["results"]; items?: ListItem[] }
  | { phase: "done"; response: string; results: SearchUseCase["results"]; items?: ListItem[] };

function SentinelIconSmall({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--foreground)]">
      <g clipPath="url(#sentinel-search-clip)">
        <path d="M0 8C0 7.55817 0.358172 7.2 0.8 7.2H3.508C3.99291 7.2 4.47307 7.10448 4.92105 6.91889C5.36904 6.7333 5.77608 6.46127 6.11892 6.11836C6.46177 5.77544 6.7337 5.36834 6.91919 4.92031C7.10469 4.47229 7.20011 3.99211 7.2 3.5072V0.799999C7.2 0.358172 7.55817 0 8 0C8.44183 0 8.8 0.358172 8.8 0.8V3.5072C8.7999 3.99217 8.89534 4.47242 9.08088 4.9205C9.26643 5.36858 9.53843 5.77571 9.88136 6.11864C10.2243 6.46157 10.6314 6.73357 11.0795 6.91912C11.5276 7.10466 12.0078 7.20011 12.4928 7.2H15.2C15.6418 7.2 16 7.55817 16 8C16 8.44183 15.6418 8.8 15.2 8.8H12.4928C12.0079 8.7999 11.5277 8.89531 11.0797 9.08081C10.6317 9.2663 10.2246 9.53823 9.88164 9.88108C9.53873 10.2239 9.2667 10.631 9.08111 11.0789C8.89552 11.5269 8.8 12.0071 8.8 12.492V15.2C8.8 15.6418 8.44183 16 8 16C7.55817 16 7.2 15.6418 7.2 15.2V12.492C7.2 11.5128 6.81102 10.5737 6.11864 9.88136C5.42625 9.18898 4.48718 8.8 3.508 8.8H0.799999C0.358171 8.8 0 8.44183 0 8Z" fill="currentColor"/>
        <path d="M2.16525 13.8345C1.85286 13.5221 1.85286 13.0157 2.16525 12.7033L3.86245 11.0061C4.17499 10.6935 4.68174 10.6936 4.99417 11.0063C5.30647 11.3188 5.30635 11.8253 4.99389 12.1377L3.29645 13.8346C2.98404 14.1469 2.47761 14.1469 2.16525 13.8345ZM13.834 2.1657C13.5216 1.85333 13.0152 1.85333 12.7028 2.1657L11.0052 3.8633C10.6928 4.17567 10.6928 4.68213 11.0052 4.9945C11.3176 5.30687 11.824 5.30687 12.1364 4.9945L13.834 3.2969C14.1464 2.98453 14.1464 2.47807 13.834 2.1657ZM2.16517 2.16574C2.47756 1.85334 2.98406 1.85334 3.29645 2.16574L4.99365 3.86294C5.30619 4.17548 5.3061 4.68223 4.99345 4.99466C4.68093 5.30696 4.17442 5.30684 3.86205 4.99438L2.16509 3.29694C1.85277 2.98453 1.85281 2.4781 2.16517 2.16574ZM13.834 13.8345C14.1464 13.5221 14.1464 13.0156 13.8341 12.7032L12.1375 11.0062C11.825 10.6936 11.3182 10.6935 11.0056 11.0061C10.693 11.3187 10.6931 11.8255 11.0057 12.138L12.7027 13.8346C13.0152 14.1469 13.5216 14.1469 13.834 13.8345Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="sentinel-search-clip">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

const shinyTextStyle: React.CSSProperties = {
  backgroundImage: "linear-gradient(90deg, var(--shiny-text-base, rgba(0,0,0,0.35)) 0%, var(--shiny-text-base, rgba(0,0,0,0.35)) 35%, var(--shiny-text-shine, rgba(0,0,0,1)) 50%, var(--shiny-text-base, rgba(0,0,0,0.35)) 65%, var(--shiny-text-base, rgba(0,0,0,0.35)) 100%)",
  backgroundSize: "200% auto",
  backgroundPosition: "150% center",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  ["--shiny-duration" as string]: "1.2s",
};

// Typed text component matching the Sentinel agent chat pattern
function ResponseTextType({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setCharIndex(0);
    setComplete(false);
  }, [text]);

  useEffect(() => {
    if (complete) return;
    if (charIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(prev => prev + text[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 12);
      return () => clearTimeout(timeout);
    } else if (charIndex === text.length && text.length > 0) {
      setComplete(true);
      onComplete?.();
    }
  }, [charIndex, text, complete, onComplete]);

  return <span>{displayed}</span>;
}

function SearchDropdownContent({ dropdown, onResponseComplete }: { dropdown: DropdownState; onResponseComplete?: () => void }) {
  if (dropdown.phase === "hidden") return null;

  const skeletonCount = dropdown.phase === "thinking" ? dropdown.resultCount : 0;
  const skeletonItemCount = dropdown.phase === "thinking" ? dropdown.itemCount : 0;
  const showResults = dropdown.phase === "responding" || dropdown.phase === "done";
  const results = showResults ? dropdown.results : [];
  const items = showResults && "items" in dropdown ? dropdown.items ?? [] : [];

  return (
    <motion.div
      className="absolute left-0 right-0 top-full mt-2 bg-[var(--background)] rounded-xl border border-[var(--foreground)]/10 shadow-lg p-4 z-20"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Thinking state */}
      {dropdown.phase === "thinking" && (
        <>
          <div className="flex items-start gap-2">
            <motion.div className="mt-[3px] shrink-0 flex items-center" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <SentinelIconSmall size={16} />
            </motion.div>
            <span className="text-base shiny-text-animate" style={shinyTextStyle}>thinking...</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <SkeletonTile key={i} />
            ))}
          </div>
          {skeletonItemCount > 0 && (
            <div className="mt-3 flex flex-col">
              {Array.from({ length: skeletonItemCount }).map((_, i) => (
                <SkeletonListItemRow key={i} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Response state - typed text + real result tiles */}
      {showResults && (
        <>
          <div className="flex items-start gap-2">
            <div className="mt-[3px] shrink-0 flex items-center">
              <SentinelIconSmall size={16} />
            </div>
            <span className="text-base text-[var(--foreground)]">
              {dropdown.phase === "responding" ? (
                <ResponseTextType text={dropdown.response} onComplete={onResponseComplete} />
              ) : (
                dropdown.response
              )}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {results.map((result, i) => (
              <AppTile key={result.name} name={result.name} logo={result.logo} animate delay={i * 0.08} />
            ))}
          </div>
          {items.length > 0 && (
            <div className="mt-3 flex flex-col">
              {items.map((item, i) => (
                <ListItemRow key={item.name} {...item} animate delay={(results.length + i) * 0.08} />
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

function AppTile({ name, logo, animate: shouldAnimate, delay = 0 }: { name: string; logo: string; animate?: boolean; delay?: number }) {
  const content = (
    <>
      <div className="w-8 h-8 relative">
        <Image src={logo} alt={`${name} logo`} fill className="object-contain" />
      </div>
      <span className="text-sm text-[var(--foreground)]/70 font-medium text-center leading-tight">{name}</span>
    </>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        className="bg-[var(--foreground)]/[0.03] rounded-xl p-4 flex flex-col items-center gap-2.5 border border-[var(--foreground)]/10"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className="bg-[var(--foreground)]/[0.03] rounded-xl p-4 flex flex-col items-center gap-2.5 border border-[var(--foreground)]/10">
      {content}
    </div>
  );
}

function SkeletonTile() {
  return (
    <div className="bg-[var(--foreground)]/[0.04] rounded-xl p-4 flex flex-col items-center gap-2.5 animate-pulse">
      <div className="w-8 h-8 rounded-md bg-[var(--foreground)]/[0.06]" />
      <div className="w-10 h-3.5 rounded-full bg-[var(--foreground)]/[0.06]" />
    </div>
  );
}

function ListItemRow({ name, type, icon, animate: shouldAnimate, delay = 0 }: ListItem & { animate?: boolean; delay?: number }) {
  const content = (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
      <div className="w-6 h-6 relative shrink-0">
        <Image src={icon} alt={`${type} icon`} fill className="object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--foreground)] truncate">{name}</p>
        <p className="text-xs text-[var(--foreground)]/50">{type}</p>
      </div>
      <span className="text-xs font-medium text-blue-500 shrink-0">View</span>
    </div>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        className="border-t border-[var(--foreground)]/[0.06] first:border-t-0"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className="border-t border-[var(--foreground)]/[0.06] first:border-t-0">
      {content}
    </div>
  );
}

function SkeletonListItemRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg animate-pulse border-t border-[var(--foreground)]/[0.06] first:border-t-0">
      <div className="w-6 h-6 rounded-md bg-[var(--foreground)]/[0.06] shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="w-28 h-2.5 rounded-full bg-[var(--foreground)]/[0.06]" />
        <div className="w-16 h-2 rounded-full bg-[var(--foreground)]/[0.06]" />
      </div>
      <div className="w-6 h-2 rounded-full bg-[var(--foreground)]/[0.06] shrink-0" />
    </div>
  );
}

const appTiles = [
  { name: "Slack", logo: "/images/logos/slack.svg" },
  { name: "Notion", logo: "/images/logos/notion.svg" },
  { name: "Google Drive", logo: "/images/logos/googledrive.svg" },
  { name: "Okta", logo: "/images/logos/okta.svg" },
  { name: "Personio", logo: "/images/logos/personio.svg" },
  { name: "Xero", logo: "/images/logos/xero.svg" },
  { name: "Expensify", logo: "/images/logos/expensify.svg" },
  { name: "QuickBooks", logo: "/images/logos/quickbooks.svg" },
];

function EndUserSearchUI() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [searchValue, setSearchValue] = useState("");
  const [showCaret, setShowCaret] = useState(false);
  const [dropdown, setDropdown] = useState<DropdownState>({ phase: "hidden" });
  const cancelledRef = useRef(false);
  const responseCompleteRef = useRef<(() => void) | null>(null);

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const typeText = async (text: string, speed: number, setter: (v: string) => void) => {
    for (let i = 1; i <= text.length; i++) {
      if (cancelledRef.current) return;
      await wait(speed);
      setter(text.slice(0, i));
    }
  };

  const eraseText = async (text: string, speed: number, setter: (v: string) => void) => {
    for (let i = text.length - 1; i >= 0; i--) {
      if (cancelledRef.current) return;
      await wait(speed);
      setter(text.slice(0, i));
    }
  };

  // Wait for ResponseTextType to finish typing
  const waitForResponseComplete = (): Promise<void> => new Promise<void>((resolve) => {
    responseCompleteRef.current = resolve;
  });

  const handleResponseComplete = useCallback(() => {
    responseCompleteRef.current?.();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    cancelledRef.current = false;

    async function runCycle() {
      await wait(800);

      while (!cancelledRef.current) {
        for (const useCase of searchUseCases) {
          if (cancelledRef.current) return;

          // 1. Type query into search
          setShowCaret(true);
          await typeText(useCase.query, 50, setSearchValue);
          if (cancelledRef.current) return;

          await wait(400);

          // 2. Show thinking with skeleton tiles
          setDropdown({ phase: "thinking", resultCount: useCase.results.length, itemCount: useCase.items?.length ?? 0 });
          if (cancelledRef.current) return;

          await wait(2000);

          // 3. Switch to responding — TextType component handles the typing
          setDropdown({ phase: "responding", response: useCase.response, results: useCase.results, items: useCase.items });
          await waitForResponseComplete();
          if (cancelledRef.current) return;

          // 4. Mark as done, hold result
          setDropdown({ phase: "done", response: useCase.response, results: useCase.results, items: useCase.items });
          await wait(3000);

          // 5. Close dropdown, erase search, pause
          setDropdown({ phase: "hidden" });
          await wait(300);
          await eraseText(useCase.query, 20, setSearchValue);
          setShowCaret(false);
          await wait(800);
        }
      }
    }

    runCycle();
    return () => { cancelledRef.current = true; };
  }, [isInView]);

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col items-center max-w-[660px] mx-4 sm:mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full bg-white/20 backdrop-blur-xl rounded-2xl p-2 border border-white/30">
      <div className="bg-[var(--background)] rounded-xl p-6 md:p-8 flex flex-col items-center gap-6">
        {/* Search bar with popover anchor */}
        <div className="relative w-full">
          <div className="w-full flex items-center gap-3 bg-[var(--background)] rounded-full px-5 py-3 border border-[var(--foreground)]/15 cursor-default select-none">
            <svg className="w-5 h-5 text-[var(--foreground)]/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <div className="flex-1 text-base min-h-[1.5em] flex items-center">
              {searchValue ? (
                <span className="text-[var(--foreground)]">
                  {searchValue}
                  {showCaret && (
                    <span
                      className="inline-block w-[2px] h-[1.1em] bg-[var(--foreground)] align-text-bottom ml-px"
                      style={{ animation: "blink-caret 1s step-end infinite" }}
                    />
                  )}
                </span>
              ) : (
                <span className="text-[var(--foreground)]/40">Search apps or ask a question</span>
              )}
            </div>
          </div>

          {/* Dropdown popover */}
          <AnimatePresence>
            {dropdown.phase !== "hidden" && (
              <SearchDropdownContent dropdown={dropdown} onResponseComplete={handleResponseComplete} />
            )}
          </AnimatePresence>
        </div>

        {/* App tiles grid - always visible */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {appTiles.map((app) => (
            <AppTile key={app.name} name={app.name} logo={app.logo} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

type ImageFocus = "insights" | "tasks" | "support" | null;

const imageTransforms: Record<NonNullable<ImageFocus>, string> = {
  insights: "scale(2) translate(-25%, 10%)",
  tasks: "scale(2) translate(-25%, -5%)",
  support: "scale(2) translate(-25%, -15%)",
};

function SolutionSection() {
  const [activeFocus, setActiveFocus] = useState<ImageFocus>(null);

  const handleMouseEnter = (focus: ImageFocus) => {
    setActiveFocus(focus);
  };
  
  const handleMouseLeave = () => {
    setActiveFocus(null);
  };

  return (
    <FullWidthContent className="mt-0">
      <div className="grid grid-cols-1 bg-[var(--background)] border border-[var(--foreground)]/20 lg:grid-cols-2 items-stretch overflow-hidden">
        <div className="p-6 xs:p-8 sm:p-12 flex items-center">
          <section id="solution" className="flex flex-col gap-4 xs:gap-5 sm:gap-6 scroll-mt-8">
            <SkewedTag as="h3" className="text-lg lg:text-xl">The solution</SkewedTag>
            <p className="text-[var(--foreground)] text-2xl md:text-3xl lg:text-4xl leading-relaxed">
              An AI Agent which can{" "}
              <HighlightText
                color="blue"
                onMouseEnter={() => handleMouseEnter("insights")}
                onMouseLeave={handleMouseLeave}
                isActive={activeFocus === "insights"}
              >
                generate insights
              </HighlightText>
              ,{" "}
              <HighlightText
                color="purple"
                onMouseEnter={() => handleMouseEnter("tasks")}
                onMouseLeave={handleMouseLeave}
                isActive={activeFocus === "tasks"}
              >
                automate tasks
              </HighlightText>{" "}
              and{" "}
              <HighlightText
                color="brown"
                onMouseEnter={() => handleMouseEnter("support")}
                onMouseLeave={handleMouseLeave}
                isActive={activeFocus === "support"}
              >
                provide support
              </HighlightText>
              .
            </p>
          </section>
        </div>

        <div 
          className="p-6 pl-0 relative"
          style={{
            backgroundImage: "url('/images/work/sentinel/preview-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "left center",
          }}
        >
          <div className="relative overflow-hidden">
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
        bannerBg: "/images/shared/pixel-forest-canopy.png",
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
    bannerBg: "/images/shared/pixel-cloud-spiral.png",
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
      bannerBg: "/images/shared/pixel-autumn-foliage.png",
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
            >
                <Image
                  src={item.bannerBg}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, 128px"
                />
                <div className="relative rounded-lg bg-white/30 backdrop-blur-sm p-1">
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
    <CaseStudyLayout caseStudy={caseStudy} sections={caseStudy.sections}>
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
      <NarrowContent className="mt-16" id="comparative-audit">
          <SkewedTag as="h2" className="text-lg lg:text-xl">Making the case for Agentic AI</SkewedTag>
          <LargeText as="h3">Choosing not to play was an existential risk.</LargeText>
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
            I put together a summary to share with stakeholders and Product leadership to demonstrate where we were falling behind and why we needed to act.
        </BodyText>

        <QuoteCard attribution="Buzz Woeckener – 1Password Customer Advisory Board">
            AI is the next competitive advantage — we want to automate the simple things so we can humanize the difficult things.
        </QuoteCard>
      </NarrowContent>


      <NarrowContent className="mt-16">
        <ContentSection id="admin-pain-points" title="Understanding our Admin pain points">
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
        <ContentSection id="vibe-coding" title="Vibe-coding a proof of concept">
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
      <NarrowContent id="user-testing">
          <SkewedTag as="h2" className="text-lg lg:text-xl">User testing</SkewedTag>
          <LargeText as="h3">Is a chatbot truly valuable for Admins – or just another case of AI slop?</LargeText>
          <BodyText>
            I partnered with Marta, our AI researcher, to run a study to validate the concept and get insights into how organisation's are using AI internally to help them manage their security.
          </BodyText>

        <BodyText>
          We expected admins to be skeptical of Agentic AI within 1Password. Instead, many were excited about using AI to help manage their security and reduce their workload.
        </BodyText>
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
        <ContentSection id="storytelling" title="Telling Sonja's story">
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
      <div className="relative w-full overflow-hidden">

        <MediaCarousel cardWidth={1000} gap={48} className="relative py-8 z-10">
          {/* Slide 1: Comic intro */}
          <ComicSlide>
            <Image
              src="/images/work/sentinel/sonja-comic-start.jpg"
              alt="Sonja's day-in-the-life comic introduction"
              width={1040}
              height={567}
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
            />
          </ComicSlide>
        </MediaCarousel>
        </div>

        <ZigZagDivider />

      {/* The End-User Section */}
      <NarrowContent id="end-user">
          <SkewedTag as="h2" className="text-lg lg:text-xl">Agentic Search</SkewedTag>
          <LargeText as="h3">Helping employees find the apps and tools for their organisation using intelligent search.</LargeText>
          <BodyText>
            Sentinel is about solving pain points for the admin experience. However a common pain point for the employees using 1Password within organisations is often not knowing the software they have access to. How do I book time off? Where do I find those analytics again? Where do I file bug reports? SaaS sprawl across organisations means that employees often struggle to find what they're looking for.
          </BodyText>
          
      </NarrowContent>

      {/* Pixel grassy field background section with app search UI */}
      <div className="relative w-full py-16 md:py-28 overflow-hidden">
        <Image
          src="/images/shared/pixel-grassy-field.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        <EndUserSearchUI />
      </div>

      <NarrowContent>
        <BodyText>
          Agentic search is a way to help employees find the apps and tools for their organisation by using simple, natural language.
        </BodyText>
        <BodyText>
          I created a proof of concept for agentic search that uses the OpenAI API to search the apps and tools for an organisation.
        </BodyText>
      </NarrowContent>

        <ZigZagDivider />

          <NarrowContent id="impact">
            <SkewedTag as="h2" className="text-lg lg:text-xl">Impact and next steps?</SkewedTag>
            <LargeText as="h3">Sentinel was paused to focus on external AI security efforts.</LargeText>
            <BodyText>
              Despite strong internal and external signals that an agentic AI system like Sentinel within the 1Password admin console would be a valuable undertaking, the AI team was ultimately repurposed to focus on external AI security efforts, and therefore Sentinel was put on ice for the time being.
            </BodyText>
            <BodyText>
              I'm proud of the work that went into crafting and selling this vision. It helped paint a picture of the future of AI in the admin console and as the technology matures, I'm confident something like Sentinel will find its way into the product in the future.
            </BodyText>
          </NarrowContent>
    </CaseStudyLayout>
  );
}
