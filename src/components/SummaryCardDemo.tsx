"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// ===============================
// TEXT TYPE COMPONENT (from React Bits https://github.com/davidhdev/react-bits)
// ===============================

interface TextTypeProps {
  text: string;
  className?: string;
  showCursor?: boolean;
  cursorCharacter?: string;
  typingSpeed?: number;
  initialDelay?: number;
  onComplete?: () => void;
}

function TextType({
  text,
  className = '',
  showCursor = false,
  cursorCharacter = '|',
  typingSpeed = 30,
  initialDelay = 0,
  onComplete,
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentCharIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (isComplete) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (currentCharIndex < text.length) {
      const delay = currentCharIndex === 0 ? initialDelay : typingSpeed;
      timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentCharIndex]);
        setCurrentCharIndex(prev => prev + 1);
      }, delay);
    } else if (currentCharIndex === text.length && text.length > 0) {
      setIsComplete(true);
      onComplete?.();
    }

    return () => clearTimeout(timeout);
  }, [currentCharIndex, text, typingSpeed, initialDelay, isComplete, onComplete]);

  return (
    <span className={`inline ${className}`}>
      <span>{displayedText}</span>
      {showCursor && !isComplete && (
        <span 
          className="ml-0.5 inline-block animate-pulse"
          style={{ animationDuration: '0.7s' }}
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  );
}

type CardType = "skeleton" | "item-list" | "item-sharing" | "watchtower" | "task";

// ===============================
// CHAT TYPES & DATA
// ===============================

type MessageRole = "user" | "agent";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  cardType?: Exclude<CardType, "skeleton">;
}

interface ConversationTemplate {
  question: string;
  response: string;
  cardType?: Exclude<CardType, "skeleton">;
}

// Sentinel conversation templates - admin copilot use cases
const sentinelConversationTemplates: ConversationTemplate[] = [
  {
    question: "Which items are in the Finance vault?",
    response: "Here are the 4 items in your Finance vault:",
    cardType: "item-list",
  },
  {
    question: "Who is NetSuite shared with?",
    response: "NetSuite is shared with 6 people. Here's who has access:",
    cardType: "item-sharing",
  },
  {
    question: "Was Plex involved in a breach recently?",
    response: "Yes, Plex was involved in a data breach in August 2022. Here's the Watchtower report:",
    cardType: "watchtower",
  },
  {
    question: "Rotate the NetSuite password and notify affected users",
    response: "I can help with that. Here's what I'll do:",
    cardType: "task",
  },
];

// Agentic Autofill conversation templates - "problem" view showing insecure credential sharing
const agenticAutofillConversationTemplates: ConversationTemplate[] = [
  {
    question: "Go to my Stripe dashboard and show me today's payouts.",
    response: "Got it. To do this I'll need your username and password for Stripe.",
  },
  {
    question: "Sure thing. Here they are. \n\nusername: sonja.johnson@acmeltd.com\npassword: DoILookLikeATuringTest",
    response: "Thanks! brb hacking your stripe account. Just kidding... or am I???",
  },
];

// Prompt Design conversation templates - showing guidelines for AI agents
interface PromptDesignTemplate {
  question: string;
  response: string;
  guideline?: {
    title: string;
    description: string;
  };
}

const promptDesignConversationTemplates: PromptDesignTemplate[] = [
  {
    question: "Find me a Nintendo Switch OLED console on Amazon for under $400.",
    response: "I'll help you find a Nintendo Switch OLED console on Amazon for under $400 including shipping.\n\nDo you want me to check your 1Password account for an Amazon login or do you want to provide this?",
    guideline: {
      title: "Ask first before checking",
      description: "The first time a user connects 1Password, the agent should ask permission before accessing credentials. Once granted, subsequent requests in the same session don't require re-asking.",
    },
  },
  {
    question: "Yes, use my Amazon login from 1Password.",
    response: "→ Checking 1Password for your Amazon credentials...\n→ Found credentials. Asking 1Password to sign in...\n→ Signed in successfully.\n\nSearching for Nintendo Switch OLED consoles under $400.",
    guideline: {
      title: "Show the chain of thought",
      description: "Agents should communicate each step when interacting with 1Password—checking for credentials, requesting sign-in, and confirming authentication complete.",
    },
  },
  {
    question: "Yes, add the cheapest one to my cart.",
    response: "I've added the Nintendo Switch OLED to your cart for $349.99.\n\nTo complete checkout, I'll need payment and shipping details. Should I check 1Password for your saved payment method and address?",
    guideline: {
      title: "Request only what's needed",
      description: "When accessing sensitive information like payment details, agents should clearly explain why the information is needed and request explicit permission before proceeding.",
    },
  },
  {
    question: "Great, complete the purchase.",
    response: "Before I place this order, please confirm:\n\n• Nintendo Switch OLED – $349.99\n• Shipping to 123 Main St, Seattle WA\n• Payment: Visa ending in 4242\n\nTotal: $349.99. Shall I proceed?",
    guideline: {
      title: "Confirm before irreversible actions",
      description: "For purchases, transfers, or other actions that can't be undone, agents should summarize the details and request explicit confirmation before proceeding.",
    },
  },
  {
    question: "Yes, place the order.",
    response: "Order placed successfully! Your Nintendo Switch will arrive by Thursday.\n\nYour payment and address details were handled securely through 1Password and have not been stored in this conversation.",
    guideline: {
      title: "Never log credentials",
      description: "Credentials and sensitive data should never persist in conversation history, logs, or memory. After use, no trace of the credential content should remain.",
    },
  },
];

// Solution uses a step-based system for more complex flows
type SolutionStepType = "user-message" | "agent-message" | "agent-working" | "permission-card" | "user-action";

interface SolutionStep {
  type: SolutionStepType;
  content?: string;
  duration?: number; // How long to show before auto-advancing (for working text)
}

const solutionSteps: SolutionStep[] = [
  { type: "user-message", content: "Go to my Stripe dashboard and show me today's payouts." },
  { type: "agent-message", content: "Got it. I'll check 1Password for Stripe credentials." },
  { type: "agent-working", content: "Checking 1Password...", duration: 1500 },
  { type: "agent-working", content: "Requesting access...", duration: 1500 },
  { type: "agent-message", content: "Do you want to allow 1Password to autofill your credentials for me?" },
  { type: "permission-card" },
  { type: "user-action", content: "Authorize" },
  { type: "agent-working", content: "Asking 1Password to sign in to Stripe...", duration: 2000 },
  { type: "agent-message", content: "I'm signed in. Finding today's payouts." },
  { type: "agent-working", content: "Thinking...", duration: 2500 },
];

// Keep old templates for non-headerLabel mode
const solutionTemplates: ConversationTemplate[] = [
  { question: "", response: "" },
];

// Skeleton base with shimmer
function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded ${className}`} />;
}

// Transitioning element - shows skeleton or content
function TransitionElement({
  isLoading,
  skeleton,
  children,
  delay = 0,
}: {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div className="relative">
      {/* Skeleton layer */}
      <motion.div
        initial={false}
        animate={{
          opacity: isLoading ? 1 : 0,
          scale: isLoading ? 1 : 0.95,
        }}
        transition={{ duration: 0.3, delay: isLoading ? 0 : delay }}
        className={isLoading ? "relative" : "absolute inset-0 pointer-events-none"}
      >
        {skeleton}
      </motion.div>
      {/* Content layer */}
      <motion.div
        initial={false}
        animate={{
          opacity: isLoading ? 0 : 1,
          scale: isLoading ? 1.05 : 1,
        }}
        transition={{ duration: 0.3, delay: isLoading ? 0 : delay }}
        className={isLoading ? "absolute inset-0 pointer-events-none" : "relative"}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Card wrapper - matches Figma: corner-radius/large (12px), border/neutral
function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className={`bg-[var(--background)] rounded-[12px] max-w-[328px] w-full border border-[var(--foreground)]/10 overflow-hidden ${inter.className}`}
    >
      {children}
    </div>
  );
}

// ===============================
// CARD CONTENT DEFINITIONS
// ===============================

interface CardConfig {
  header: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    subtitle: string;
    actions?: React.ReactNode;
  };
  body: React.ReactNode;
}

// Icon button - Figma: min-h-28px, px-6px, py-5.5px, rounded-8px
function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button 
      className="min-h-[28px] px-1.5 py-[5.5px] flex items-center justify-center rounded-[8px] transition-colors hover:bg-[var(--foreground)]/5 text-[var(--foreground)]/60"
    >
      {children}
    </button>
  );
}

// ===============================
// UNIFIED ROW COMPONENT
// ===============================

// Avatar colors matching 1Password design system
const avatarColors = {
  magenta: "#e6b7e6",
  violet: "#c9ade6",
  purple: "#b8b8e6",
  lavender: "#adc9e6",
  blue: "#ade6e6",
  turquoise: "#ade6c9",
  lime: "#c9e6ad",
  yellow: "#e6e6ad",
  gold: "#e6d4ad",
  orange: "#e6c9ad",
  peach: "#e6b8ad",
  red: "#e6adad",
  pink: "#e6adc9",
  green: "#ade6ad",
} as const;

type AvatarColor = keyof typeof avatarColors;

// Avatar component for initials-based avatars (matches login item style)
function Avatar({ 
  initials, 
  color,
  size = 24,
}: { 
  initials: string; 
  color: AvatarColor;
  size?: number;
}) {
  return (
    <div 
      className="rounded-[6px] flex items-center justify-center font-semibold shrink-0 leading-[1.2] uppercase text-black/60"
      style={{ 
        backgroundColor: avatarColors[color], 
        width: size, 
        height: size,
        fontSize: size < 24 ? 8 : 10,
        letterSpacing: "0.01px",
      }}
    >
      {initials}
    </div>
  );
}

// Unified row component for all list-style items
interface RowProps {
  icon: React.ReactNode;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  trailing?: React.ReactNode;
  iconShape?: "square" | "circle";
  size?: "default" | "compact";
  isLoading?: boolean;
}

function Row({ 
  icon, 
  title, 
  subtitle, 
  trailing,
  iconShape = "square",
  size = "default",
  isLoading = false,
}: RowProps) {
  return (
    <div className={`flex items-center gap-3 px-4 ${size === "compact" ? "h-[40px]" : "h-[56px]"}`}>
      <div className={`w-6 h-6 overflow-hidden shrink-0 flex items-center justify-center ${
        iconShape === "circle" ? "rounded-full" : "rounded-[4px]"
      }`}>
        {isLoading ? (
          <div className={`skeleton-shimmer w-6 h-6 ${iconShape === "circle" ? "rounded-full" : "rounded-[6px]"}`} />
        ) : icon}
      </div>
      <div className="min-w-0 flex-1 leading-[1.2]">
        {isLoading ? (
          <>
            <div className="skeleton-shimmer h-[10px] w-[114px] rounded-full mb-1" />
            <div className="skeleton-shimmer h-[10px] w-[66px] rounded-full" />
          </>
        ) : (
          <>
            <p 
              className="text-[14px] truncate text-[var(--foreground)]/80"
              style={{ letterSpacing: "-0.09px" }}
            >
              {title}
            </p>
            {subtitle && (
              <p 
                className="text-[12px] truncate text-[var(--foreground)]/60"
                style={{ letterSpacing: "0.01px" }}
              >
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>
      {trailing && !isLoading && trailing}
    </div>
  );
}

// Badge component for trailing badges like "You"
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span 
      className="text-[12px] px-2 py-0.5 rounded-full leading-[1.2] bg-[var(--foreground)]/5 text-[var(--foreground)]/80"
      style={{ letterSpacing: "0.01px" }}
    >
      {children}
    </span>
  );
}

// Section label for card content sections
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p 
      className="text-[14px] font-medium leading-[1.2] px-4 py-2 text-[var(--foreground)]/60"
      style={{ letterSpacing: "0.01px" }}
    >
      {children}
    </p>
  );
}

// Step component for task cards
function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-center pl-4 pr-3 py-2">
      <div className="w-8 h-8 shrink-0 flex items-center justify-center">
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold leading-[1.2] bg-[var(--foreground)]/10 text-[var(--foreground)]/60"
          style={{ letterSpacing: "0.01px" }}
        >
          {number}
        </div>
      </div>
      <p className="text-[12px] leading-[1.5] flex-1 text-[var(--foreground)]/80" style={{ letterSpacing: "0.01px" }}>
        {children}
      </p>
    </div>
  );
}

// Connector line between steps
function StepConnector() {
  return (
    <div className="h-4 pl-4 pr-3">
      <div className="w-8 h-full flex items-center justify-center">
        <div className="w-[2px] h-full rounded-full bg-[var(--foreground)]/10" />
      </div>
    </div>
  );
}

// Step list that renders steps with connectors between them
function StepList({ steps }: { steps: React.ReactNode[] }) {
  return (
    <>
      {steps.map((step, i) => (
        <div key={i}>
          {step}
          {i < steps.length - 1 && <StepConnector />}
        </div>
      ))}
    </>
  );
}

// Card configurations for each type
const cardConfigs: Record<Exclude<CardType, "skeleton">, CardConfig> = {
  "item-list": {
    header: {
      icon: (
        <Image 
          src="/images/work/sentinel/vault-finance.png" 
          alt="Finance vault" 
          width={32} 
          height={32}
          className="rounded-md"
        />
      ),
      iconBg: "",
      title: "Finance",
      subtitle: "Shared",
      actions: (
        <>
          <IconBtn>
            {/* Overflow menu */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </IconBtn>
          <IconBtn>
            {/* Chevron up */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </IconBtn>
        </>
      ),
    },
    body: (
      <div className="flex flex-col">
        <Row
          icon={<Image src="/images/work/sentinel/logo-netsuite.png" alt="NetSuite" width={24} height={24} className="rounded-[4px]" />}
          title="NetSuite"
          subtitle="Work4WorkFinance"
        />
        <Row
          icon={<Image src="/images/work/sentinel/logo-aws.png" alt="AWS" width={24} height={24} className="rounded-[4px]" />}
          title="Amazon test"
          subtitle="emma.brown@work4work.org"
        />
        <Row
          icon={<Image src="/images/work/sentinel/logo-starbucks.png" alt="Starbucks" width={24} height={24} className="rounded-[4px]" />}
          title="Starbucks"
          subtitle="emma.brown@work4work.org"
        />
        <Row
          icon={<Image src="/images/work/sentinel/logo-plex.png" alt="Plex" width={24} height={24} className="rounded-[4px]" />}
          title="Plex"
          subtitle="emma.brown@work4work.org"
        />
      </div>
    ),
  },
  "item-sharing": {
    header: {
      icon: (
        <Image 
          src="/images/work/sentinel/logo-netsuite.png" 
          alt="NetSuite" 
          width={32} 
          height={32}
          className="rounded-[8px]"
        />
      ),
      iconBg: "",
      title: "NetSuite",
      subtitle: "Work4WorkFinance",
      actions: (
        <>
          <IconBtn>
            {/* Overflow menu */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </IconBtn>
          <IconBtn>
            {/* Chevron up */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </IconBtn>
        </>
      ),
    },
    body: (
      <div>
        {/* Located in section */}
        <div>
          <SectionLabel>Located in:</SectionLabel>
          <Row
            icon={<Image src="/images/work/sentinel/vault-finance.png" alt="Finance vault" width={24} height={24} className="rounded-[4px]" />}
            title="Finance"
            subtitle="Shared"
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--foreground)]/10 mx-4" />

        {/* People with access section */}
        <div className="pt-1 pb-2">
          <SectionLabel>6 people have access:</SectionLabel>
          {[
            { initials: "SJ", name: "Sonja Johnson", color: "magenta" as AvatarColor, isYou: true },
            { initials: "EB", name: "Emma Brown", color: "violet" as AvatarColor, isYou: false },
            { initials: "KS", name: "Kira Smith", color: "turquoise" as AvatarColor, isYou: false },
            { initials: "LW", name: "Leon Waters", color: "orange" as AvatarColor, isYou: false },
            { initials: "JS", name: "John Smith", color: "blue" as AvatarColor, isYou: false },
          ].map((person, i) => (
            <Row
              key={i}
              icon={<Avatar initials={person.initials} color={person.color} />}
              title={person.name}
              trailing={person.isYou ? <Badge>You</Badge> : undefined}
              size="compact"
            />
          ))}
        </div>
      </div>
    ),
  },
  watchtower: {
    header: {
      icon: (
        <Image 
          src="/images/work/sentinel/logo-plex.png" 
          alt="Plex" 
          width={32} 
          height={32}
          className="rounded-[8px]"
        />
      ),
      iconBg: "",
      title: "Plex",
      subtitle: "Watchtower report",
      actions: (
        <>
          <IconBtn>
            {/* Overflow menu */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </IconBtn>
          <IconBtn>
            {/* Chevron up */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </IconBtn>
        </>
      ),
    },
    body: (
      <div>
        {/* Description paragraph */}
        <div className="px-4 py-2">
          <p 
            className="text-[13px] leading-[1.5] text-[var(--foreground)]/80"
            style={{ letterSpacing: "0.01px" }}
          >
            In August 2022 Plex discovered suspicious activity on one of their databases. Plex began an investigation and it appears that a third-party was able to access a limited subset of data that includes emails, usernames, and encrypted passwords.
          </p>
        </div>

        {/* Affected data section */}
        <SectionLabel>Affected data</SectionLabel>
        <div className="flex flex-wrap gap-2 px-3">
          {["Email addresses", "Passwords", "IP addresses", "Usernames"].map((label, i) => (
            <span 
              key={i}
              className="text-[12px] py-1 px-2 rounded-full leading-[1.2] flex items-center bg-[#FFEFEB] text-[#A32600] dark:bg-[#2F150E] dark:text-[#FEBEAE]"
              style={{ letterSpacing: "0.01px" }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Affected users section */}
        <div className="pt-3">
          <SectionLabel>Affected users</SectionLabel>
          <div className="pb-2">
            <Row
              icon={<Avatar initials="EB" color="violet" />}
              title="Emma Brown"
              subtitle="emma.brown@work4work.org"
              size="compact"
            />
          </div>
        </div>

        {/* Footer with Learn more button */}
        <div className="flex justify-end p-4">
          <button 
            className="flex items-center gap-2 px-2 py-[5.5px] min-h-[28px] rounded-[8px] text-[14px] leading-[1.2] border border-[var(--foreground)]/10 transition-colors hover:bg-[var(--foreground)]/5 text-[var(--foreground)]/80"
            style={{ letterSpacing: "-0.09px" }}
          >
            {/* External link icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Learn more
          </button>
        </div>
      </div>
    ),
  },
  task: {
    header: {
      icon: (
        <Image 
          src="/images/work/sentinel/sentinel-tasks-icon.png" 
          alt="Sentinel tasks" 
          width={32} 
          height={32}
          className="rounded-[8px]"
        />
      ),
      iconBg: "",
      title: "Sentinel tasks",
      subtitle: "3 tasks",
      actions: (
        <>
          <IconBtn>
            {/* Overflow menu */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </IconBtn>
          <IconBtn>
            {/* Chevron up */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </IconBtn>
        </>
      ),
    },
    body: (
      <div>
        <StepList steps={[
          <Step number={1}>
            Send a notification to <span className="font-semibold">Emma Brown</span> to change her <span className="font-semibold">Plex</span> password
          </Step>,
          <Step number={2}>
            Rotate the password for the <span className="font-semibold">NetSuite</span> login
          </Step>,
          <Step number={3}>
            Create a Watchtower report for Reused passwords
          </Step>,
        ]} />

        {/* Footer */}
        <div className="flex gap-2 justify-end p-4">
          <button 
            className="text-[14px] px-2 py-[5.5px] min-h-[28px] rounded-[8px] leading-[1.2] transition-colors hover:bg-[var(--foreground)]/5 text-[var(--foreground)]/80 border border-[var(--foreground)]/10"
            style={{ letterSpacing: "-0.09px" }}
          >
            Cancel
          </button>
          <button 
            className="text-[14px] px-2 py-[5.5px] min-h-[28px] rounded-[8px] bg-[#0570eb] text-white leading-[1.2] hover:bg-[#0560d0] transition-colors"
            style={{ letterSpacing: "-0.09px" }}
          >
            Authorize
          </button>
        </div>
      </div>
    ),
  },
};

// ===============================
// UNIVERSAL SKELETON
// ===============================

// Universal skeleton body used for all card types
const UniversalSkeleton = () => (
  <div className="overflow-hidden">
    {/* 3 skeleton rows using Row component */}
    <Row icon={null} title="" isLoading />
    <Row icon={null} title="" isLoading />
    <Row icon={null} title="" isLoading />
    {/* Footer with 2 buttons */}
    <div className="flex gap-2 justify-end px-4 py-4">
      <div className="skeleton-shimmer h-[28px] w-[84px] rounded-[8px]" />
      <div className="skeleton-shimmer h-[28px] w-[84px] rounded-[8px]" />
    </div>
  </div>
);

// ===============================
// CHAT UI COMPONENTS
// ===============================

// Sentinel icon SVG
function SentinelIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--foreground)]">
      <g clipPath="url(#sentinel-clip)">
        <path d="M0 8C0 7.55817 0.358172 7.2 0.8 7.2H3.508C3.99291 7.2 4.47307 7.10448 4.92105 6.91889C5.36904 6.7333 5.77608 6.46127 6.11892 6.11836C6.46177 5.77544 6.7337 5.36834 6.91919 4.92031C7.10469 4.47229 7.20011 3.99211 7.2 3.5072V0.799999C7.2 0.358172 7.55817 0 8 0C8.44183 0 8.8 0.358172 8.8 0.8V3.5072C8.7999 3.99217 8.89534 4.47242 9.08088 4.9205C9.26643 5.36858 9.53843 5.77571 9.88136 6.11864C10.2243 6.46157 10.6314 6.73357 11.0795 6.91912C11.5276 7.10466 12.0078 7.20011 12.4928 7.2H15.2C15.6418 7.2 16 7.55817 16 8C16 8.44183 15.6418 8.8 15.2 8.8H12.4928C12.0079 8.7999 11.5277 8.89531 11.0797 9.08081C10.6317 9.2663 10.2246 9.53823 9.88164 9.88108C9.53873 10.2239 9.2667 10.631 9.08111 11.0789C8.89552 11.5269 8.8 12.0071 8.8 12.492V15.2C8.8 15.6418 8.44183 16 8 16C7.55817 16 7.2 15.6418 7.2 15.2V12.492C7.2 11.5128 6.81102 10.5737 6.11864 9.88136C5.42625 9.18898 4.48718 8.8 3.508 8.8H0.799999C0.358171 8.8 0 8.44183 0 8Z" fill="currentColor"/>
        <path d="M2.16525 13.8345C1.85286 13.5221 1.85286 13.0157 2.16525 12.7033L3.86245 11.0061C4.17499 10.6935 4.68174 10.6936 4.99417 11.0063C5.30647 11.3188 5.30635 11.8253 4.99389 12.1377L3.29645 13.8346C2.98404 14.1469 2.47761 14.1469 2.16525 13.8345ZM13.834 2.1657C13.5216 1.85333 13.0152 1.85333 12.7028 2.1657L11.0052 3.8633C10.6928 4.17567 10.6928 4.68213 11.0052 4.9945C11.3176 5.30687 11.824 5.30687 12.1364 4.9945L13.834 3.2969C14.1464 2.98453 14.1464 2.47807 13.834 2.1657ZM2.16517 2.16574C2.47756 1.85334 2.98406 1.85334 3.29645 2.16574L4.99365 3.86294C5.30619 4.17548 5.3061 4.68223 4.99345 4.99466C4.68093 5.30696 4.17442 5.30684 3.86205 4.99438L2.16509 3.29694C1.85277 2.98453 1.85281 2.4781 2.16517 2.16574ZM13.834 13.8345C14.1464 13.5221 14.1464 13.0156 13.8341 12.7032L12.1375 11.0062C11.825 10.6936 11.3182 10.6935 11.0056 11.0061C10.693 11.3187 10.6931 11.8255 11.0057 12.138L12.7027 13.8346C13.0152 14.1469 13.5216 14.1469 13.834 13.8345Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="sentinel-clip">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// Shiny text component - CSS keyframes animation to avoid per-frame JS updates and flashing
interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
}

function ShinyText({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#000000',
  spread = 120,
}: ShinyTextProps) {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    backgroundPosition: '150% center',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    ['--shiny-duration' as string]: `${speed}s`,
    ...(disabled && { animation: 'none' }),
  };

  return (
    <span
      className={`inline-block ${className} ${disabled ? '' : 'shiny-text-animate'}`}
      style={gradientStyle}
    >
      {text}
    </span>
  );
}

// Typing indicator with spinning Sentinel icon
function TypingIndicator() {
  return (
    <div className={`flex items-center gap-2 py-3 ${inter.className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <SentinelIcon size={16} />
      </motion.div>
      <ShinyText 
        text="thinking..." 
        className="text-[16px] leading-normal"
        color="var(--shiny-text-base, rgba(255,255,255,0.4))"
        shineColor="var(--shiny-text-shine, rgba(255,255,255,1))"
        speed={1.2}
        spread={90}
      />
    </div>
  );
}

// Working indicator with customizable text (for solution flow)
function WorkingIndicator({ text }: { text: string }) {
  return (
    <div className={`flex items-center gap-2 py-3 ${inter.className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <SentinelIcon size={16} />
      </motion.div>
      <ShinyText 
        text={text}
        className="text-[16px] leading-normal"
        color="var(--shiny-text-base, rgba(255,255,255,0.4))"
        shineColor="var(--shiny-text-shine, rgba(255,255,255,1))"
        speed={1.2}
        spread={90}
      />
    </div>
  );
}

// Logo URLs from logo.dev
const LOGO_URLS = {
  onePassword: "/images/1password-app-icon.png",
  browserbase: "/images/logo-browserbase.png",
  stripe: "/images/logo-stripe.png",
  github: "/images/logos/github-copilot.png",
  zapier: "/images/logos/zapier.png",
};

// Checkmark icon for the connection line - green success color
function CheckmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="8" fill="#2C6419" />
      <path d="M4.5 8L7 10.5L11.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Chevron down icon for dropdown
function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[rgba(0,0,0,0.62)] dark:text-[rgba(255,255,255,0.6)]">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Overflow menu icon (three dots)
function OverflowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[rgba(0,0,0,0.62)] dark:text-[rgba(255,255,255,0.6)]">
      <circle cx="8" cy="3" r="1.5" fill="currentColor" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="13" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Prompt Design Guideline card component with line-draw animation
function PromptGuidelineCard({ 
  title, 
  description,
}: { 
  title: string; 
  description: string;
}) {
  const [showCard, setShowCard] = useState(false);
  
  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Connector line with circle - line draws left to right */}
      <svg width="70" height="16" viewBox="0 0 70 16" fill="none" className="shrink-0 -ml-5">
        {/* Outer circle ring - pops in first */}
        <motion.circle 
          cx="8" cy="8" r="7" 
          stroke="var(--foreground)"
          strokeWidth="1" 
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
        {/* Inner filled circle */}
        <motion.circle 
          cx="8" cy="8" r="3.5" 
          fill="var(--foreground)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
        {/* Horizontal line as path - draws left to right */}
        <motion.path 
          d="M15 8 L70 8"
          stroke="var(--foreground)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 0.25, 
            delay: 0.1,
            ease: "easeOut"
          }}
          onAnimationComplete={() => setShowCard(true)}
        />
      </svg>
      
      {/* Guideline card - always rendered to maintain layout, visibility animated */}
      <motion.div 
        className="bg-[var(--background)] border border-[var(--foreground)] w-[275px] p-4 flex flex-col gap-3 overflow-hidden origin-left"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: showCard ? 1 : 0.8, 
          opacity: showCard ? 1 : 0 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
      >
            {/* Header badge */}
            <div className="bg-[var(--foreground)] px-2 py-1 self-start">
              <span className="text-[var(--background)] text-sm font-bold tracking-[-0.18px]">
                Prompt Design Guidelines
              </span>
            </div>
            
            {/* Title */}
            <h4 className="text-lg font-bold leading-tight text-[var(--foreground)]">
              {title}
            </h4>
            
            {/* Description */}
            <p className="text-[16px] leading-[1.4] text-[var(--foreground)] tracking-[-0.18px]">
              {description}
            </p>
      </motion.div>
    </motion.div>
  );
}

// Credential item type for configurable permission card
interface CredentialItem {
  name: string;
  logo: string;
  username: string;
}

// Platform configuration for permission card
interface PlatformConfig {
  name: string;
  logo: string;
  credentials: CredentialItem[];
}

// Default configurations for cycling
const permissionCardConfigs: PlatformConfig[] = [
  {
    name: "Browserbase",
    logo: "/images/logo-browserbase.png",
    credentials: [
      { name: "Stripe", logo: "/images/logo-stripe.png", username: "sonja.johnson@acmeltd.com" },
      { name: "GitHub", logo: "/images/logos/github-copilot.png", username: "sonja-johnson" },
      { name: "Zapier", logo: "/images/logos/zapier.png", username: "sonja.johnson@acmeltd.com" },
    ],
  },
  {
    name: "Claude",
    logo: "/images/logos/claude.png",
    credentials: [
      { name: "Stripe", logo: "/images/logo-stripe.png", username: "sonja.johnson@acmeltd.com" },
    ],
  },
  {
    name: "ChatGPT",
    logo: "/images/logos/chatgpt.png",
    credentials: [
      { name: "GitHub", logo: "/images/logos/github-copilot.png", username: "sonja-johnson" },
      { name: "Zapier", logo: "/images/logos/zapier.png", username: "sonja.johnson@acmeltd.com" },
    ],
  },
];

// Configurable Permission card content
export function ConfigurablePermissionCard({ 
  platform,
  onAuthorize 
}: { 
  platform: PlatformConfig;
  onAuthorize?: () => void;
}) {
  const itemCount = platform.credentials.length;
  const itemText = itemCount === 1 ? platform.credentials[0].name : `${itemCount} items`;
  
  return (
    <div 
      className={`backdrop-blur-[22px] bg-[#ededed] dark:bg-[#2a2a2a] rounded-[8px] overflow-hidden w-full max-w-[396px] ${inter.className}`}
      style={{
        boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.1), 0px 4px 16px rgba(0,0,0,0.06), 0px 8px 40px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex flex-col gap-6 items-center pt-[30px] pb-5 px-5">
        {/* Header Section */}
        <div className="flex flex-col gap-6 items-center w-full">
          <h3 className="text-[20px] font-semibold leading-[1.2] text-center text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.33px]">
            1Password Access Requested
          </h3>
          
          <div className="flex flex-col gap-3 items-center w-full">
            {/* Icon Row with Connector */}
            <div className="flex items-center gap-1">
              <div className="w-15 h-15 rounded-[12px] overflow-hidden bg-white dark:bg-[#3a3a3a] flex items-center justify-center">
                <Image 
                  src={platform.logo} 
                  alt={platform.name} 
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="flex items-center gap-1 w-16">
                <div className="flex-1 h-[2px] rounded-full bg-black dark:bg-white opacity-20" />
                <CheckmarkIcon />
                <div className="flex-1 h-[2px] rounded-full bg-black dark:bg-white opacity-20" />
              </div>
              
              <div className="w-15 h-15 rounded-[12px] overflow-hidden bg-white dark:bg-[#3a3a3a] flex items-center justify-center">
                <Image 
                  src={LOGO_URLS.onePassword} 
                  alt="1Password" 
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            
            <p className="text-[16px] leading-[1.2] text-center text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] px-1">
              Allow <span className="font-semibold text-[15.5px] tracking-[-0.17px]">{platform.name}</span> to use 1Password to<br />
              autofill <span className="font-semibold text-[15.5px] tracking-[-0.17px]">{itemText}</span> on your behalf
            </p>
          </div>
        </div>
        
        {/* Credential Rows */}
        <div className="flex flex-col gap-4 items-start w-full">
          <div className="bg-[#fafafa] dark:bg-[#1f1f1f] border border-[rgba(0,0,0,0.13)] dark:border-[rgba(255,255,255,0.13)] rounded-[8px] w-full">
            {platform.credentials.map((cred, index) => (
              <div key={index} className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-[6px] overflow-hidden bg-white dark:bg-[#3a3a3a] flex items-center justify-center">
                  <Image 
                    src={cred.logo} 
                    alt={cred.name} 
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[14px] leading-[1.2] text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.09px]">
                    {cred.name}
                  </span>
                  <span className="text-[12px] leading-[1.2] text-[rgba(0,0,0,0.62)] dark:text-[rgba(255,255,255,0.6)] tracking-[0.01px]">
                    {cred.username}
                  </span>
                </div>
                <button className="p-1.5 rounded-[8px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                  <OverflowIcon />
                </button>
              </div>
            ))}
          </div>
          
          {/* Access Duration Row */}
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] leading-[1.2] text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.09px]">
              Allow access for:
            </span>
            <div className="bg-white dark:bg-[#3a3a3a] border border-[rgba(0,0,0,0.13)] dark:border-[rgba(255,255,255,0.13)] rounded-[8px] px-2 py-1.5 flex items-center gap-2 min-w-[143px]">
              <span className="flex-1 text-[14px] leading-[1.2] text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.09px]">
                Just this task
              </span>
              <ChevronDownIcon />
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 w-full">
          <button className="px-2 py-1.5 rounded-[8px] border border-[rgba(0,0,0,0.13)] dark:border-[rgba(255,255,255,0.13)] text-[14px] leading-[1.2] text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.09px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors">
            Cancel
          </button>
          <button
            onClick={onAuthorize}
            className="px-2 py-1.5 rounded-[8px] bg-[#0570eb] text-[14px] leading-[1.2] text-white tracking-[-0.09px] hover:bg-[#0560d0] transition-colors"
          >
            Authorize
          </button>
        </div>
      </div>
    </div>
  );
}

// Cycling Permission Card with countdown - cycles through different platforms and credentials
const PERMISSION_CYCLE_DURATION = 5000; // 5 seconds per config

export function CyclingPermissionCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Start cycling when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        }
      },
      { threshold: 0.5 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Cycle through configs
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % permissionCardConfigs.length);
      setCycleKey((prev) => prev + 1);
    }, PERMISSION_CYCLE_DURATION);
    
    return () => clearTimeout(timer);
  }, [currentIndex, isActive, cycleKey]);
  
  const currentConfig = permissionCardConfigs[currentIndex];
  
  // Countdown ring
  const size = 32;
  const strokeWidth = 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isActive ? 0 : circumference;
  
  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4">
      {/* Countdown Ring */}
      <div className="flex items-center justify-center">
        <div
          className="relative flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <svg
            key={cycleKey}
            className="absolute inset-0 -rotate-90"
            width={size}
            height={size}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-[var(--foreground)]/20"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="text-[var(--foreground)]"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transition: isActive ? `stroke-dashoffset ${PERMISSION_CYCLE_DURATION}ms linear` : "none",
              }}
            />
          </svg>
          <SentinelIcon size={16} />
        </div>
      </div>
      
      {/* Permission Card with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <ConfigurablePermissionCard platform={currentConfig} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Permission card content - Figma accurate design with gray bg and shadow
export function PermissionCardContent({ onAuthorize }: { onAuthorize?: () => void }) {
  return (
    <div 
      className={`backdrop-blur-[22px] bg-[#ededed] dark:bg-[#2a2a2a] rounded-[8px] overflow-hidden w-full max-w-[396px] ${inter.className}`}
      style={{
        boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.1), 0px 4px 16px rgba(0,0,0,0.06), 0px 8px 40px rgba(0,0,0,0.1)",
      }}
    >
      {/* Content */}
      <div className="flex flex-col gap-6 items-center pt-[30px] pb-5 px-5">
        {/* Header Section */}
        <div className="flex flex-col gap-6 items-center w-full">
          {/* Title */}
          <h3 className="text-[20px] font-semibold leading-[1.2] text-center text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.33px]">
            1Password Access Requested
          </h3>
          
          {/* Access Content: Icon Row + Description */}
          <div className="flex flex-col gap-3 items-center w-full">
            {/* Icon Row with Connector - gap-[1px] between sections */}
            <div className="flex items-center gap-1">
              {/* Browserbase Logo - 64px container, flush */}
              <div className="w-15 h-15 rounded-[12px] overflow-hidden bg-white dark:bg-[#3a3a3a] flex items-center justify-center">
                <Image 
                  src={LOGO_URLS.browserbase} 
                  alt="Browserbase" 
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Connector Line with Checkmark - 64px wide, gap-[4px] */}
              <div className="flex items-center gap-1 w-16">
                <div className="flex-1 h-[2px] rounded-full bg-black dark:bg-white opacity-20" />
                <CheckmarkIcon />
                <div className="flex-1 h-[2px] rounded-full bg-black dark:bg-white opacity-20" />
              </div>
              
              {/* 1Password Logo - 64px container, flush */}
              <div className="w-15 h-15 rounded-[12px] overflow-hidden bg-white dark:bg-[#3a3a3a] flex items-center justify-center">
                <Image 
                  src={LOGO_URLS.onePassword} 
                  alt="1Password" 
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            
            {/* Description with line break */}
            <p className="text-[16px] leading-[1.2] text-center text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] px-1">
              Allow <span className="font-semibold text-[15.5px] tracking-[-0.17px]">Browserbase</span> to use 1Password to<br />
              autofill <span className="font-semibold text-[15.5px] tracking-[-0.17px]">3 items</span> on your behalf
            </p>
          </div>
        </div>
        
        {/* Credential Rows */}
        <div className="flex flex-col gap-4 items-start w-full">
          <div className="bg-[#fafafa] dark:bg-[#1f1f1f] border border-[rgba(0,0,0,0.13)] dark:border-[rgba(255,255,255,0.13)] rounded-[8px] w-full">
            {/* Stripe Row */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-[6px] overflow-hidden bg-white dark:bg-[#3a3a3a] flex items-center justify-center">
                <Image 
                  src={LOGO_URLS.stripe} 
                  alt="Stripe" 
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-[14px] leading-[1.2] text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.09px]">
                  Stripe
                </span>
                <span className="text-[12px] leading-[1.2] text-[rgba(0,0,0,0.62)] dark:text-[rgba(255,255,255,0.6)] tracking-[0.01px]">
                  sonja.johnson@acmeltd.com
                </span>
              </div>
              <button className="p-1.5 rounded-[8px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                <OverflowIcon />
              </button>
            </div>

            {/* GitHub Row */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-[6px] overflow-hidden bg-white dark:bg-[#3a3a3a] flex items-center justify-center">
                <Image 
                  src={LOGO_URLS.github} 
                  alt="GitHub" 
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-[14px] leading-[1.2] text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.09px]">
                  GitHub
                </span>
                <span className="text-[12px] leading-[1.2] text-[rgba(0,0,0,0.62)] dark:text-[rgba(255,255,255,0.6)] tracking-[0.01px]">
                  sonja-johnson
                </span>
              </div>
              <button className="p-1.5 rounded-[8px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                <OverflowIcon />
              </button>
            </div>

            {/* Zapier Row */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-[6px] overflow-hidden bg-white dark:bg-[#3a3a3a] flex items-center justify-center">
                <Image 
                  src={LOGO_URLS.zapier} 
                  alt="Zapier" 
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-[14px] leading-[1.2] text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.09px]">
                  Zapier
                </span>
                <span className="text-[12px] leading-[1.2] text-[rgba(0,0,0,0.62)] dark:text-[rgba(255,255,255,0.6)] tracking-[0.01px]">
                  sonja.johnson@acmeltd.com
                </span>
              </div>
              <button className="p-1.5 rounded-[8px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                <OverflowIcon />
              </button>
            </div>
          </div>
          
          {/* Access Duration Row */}
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] leading-[1.2] text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.09px]">
              Allow access for:
            </span>
            <div className="bg-white dark:bg-[#3a3a3a] border border-[rgba(0,0,0,0.13)] dark:border-[rgba(255,255,255,0.13)] rounded-[8px] px-2 py-1.5 flex items-center gap-2 min-w-[143px]">
              <span className="flex-1 text-[14px] leading-[1.2] text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.09px]">
                Just this task
              </span>
              <ChevronDownIcon />
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 w-full">
          <button className="px-2 py-1.5 rounded-[8px] border border-[rgba(0,0,0,0.13)] dark:border-[rgba(255,255,255,0.13)] text-[14px] leading-[1.2] text-[rgba(0,0,0,0.82)] dark:text-[rgba(255,255,255,0.9)] tracking-[-0.09px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors">
            Cancel
          </button>
          <button
            onClick={onAuthorize}
            className="px-2 py-1.5 rounded-[8px] bg-[#0570eb] text-[14px] leading-[1.2] text-white tracking-[-0.09px] hover:bg-[#0560d0] transition-colors"
          >
            Authorize
          </button>
        </div>
      </div>
    </div>
  );
}

// Authorization modal with backdrop blur overlay and pop animations
function AuthorizationModal({ 
  isOpen, 
  onAuthorize 
}: { 
  isOpen: boolean; 
  onAuthorize: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop with blur */}
          <motion.div 
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal card with scale animation */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <PermissionCardContent onAuthorize={onAuthorize} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// User message bubble (appears with fade + move, no typing)
function UserBubble({ content }: { content: string }) {
  return (
    <div
      className={`bg-[var(--foreground)]/5 px-3 py-3 rounded-[12px] text-[16px] leading-normal text-[var(--foreground)] whitespace-pre-line ${inter.className}`}
    >
      {content}
    </div>
  );
}

// Agent message - plain text with optional card
function AgentBubble({
  content,
  cardType,
  isCardLoading,
  onTypingComplete,
  staticContent = false,
}: {
  content: string;
  cardType?: Exclude<CardType, "skeleton">;
  isCardLoading?: boolean;
  onTypingComplete?: () => void;
  staticContent?: boolean;
}) {
  const config = cardType ? cardConfigs[cardType] : null;
  const [textComplete, setTextComplete] = useState(false);
  const showSkeleton = isCardLoading || !config || !textComplete;
  const isStatic = staticContent;

  const handleTextComplete = useCallback(() => {
    setTextComplete(true);
    onTypingComplete?.();
  }, [onTypingComplete]);

  // Reset text complete when content changes
  useEffect(() => {
    setTextComplete(false);
  }, [content]);

  // Parse content to separate status lines (starting with →) from regular text
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const isStatus = line.startsWith('→');
      if (isStatus) {
        return (
          <span key={i} className="block text-[14px] font-mono text-[var(--foreground)]/60">
            {line}
            {i < lines.length - 1 && '\n'}
          </span>
        );
      }
      return (
        <span key={i}>
          {line}
          {i < lines.length - 1 && '\n'}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col">
      {/* Typed text response or static */}
      <p
        className={`text-[16px] leading-normal py-3 text-[var(--foreground)] whitespace-pre-line ${inter.className}`}
      >
        {isStatic ? (
          renderContent(content)
        ) : textComplete ? (
          // Show styled content after typing completes
          renderContent(content)
        ) : (
          <TextType
            text={content}
            typingSpeed={12}
            showCursor={false}
            onComplete={handleTextComplete}
          />
        )}
      </p>
      
      {/* Summary card - shows loading state immediately, content after text completes */}
      {cardType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CardWrapper>
            {/* Header */}
            <div className="flex items-center justify-between h-[56px] px-[16px] py-1">
              <div className="flex items-center gap-3">
                <TransitionElement
                  isLoading={showSkeleton}
                  skeleton={<SkeletonBox className="w-8 h-8 rounded-[8px]" />}
                  delay={0}
                >
                  {config && (
                    <div className="w-8 h-8 rounded-[8px] overflow-hidden shrink-0">
                      {config.header.icon}
                    </div>
                  )}
                </TransitionElement>
                
                <div className="flex flex-col leading-[1.2]">
                  <TransitionElement
                    isLoading={showSkeleton}
                    skeleton={<div className="skeleton-shimmer h-[10px] w-[114px] rounded-full mb-1" />}
                    delay={0.05}
                  >
                    {config && (
                      <h4 
                        className="text-[14px] font-semibold text-[var(--foreground)]/80"
                        style={{ letterSpacing: "-0.09px" }}
                      >
                        {config.header.title}
                      </h4>
                    )}
                  </TransitionElement>
                  <TransitionElement
                    isLoading={showSkeleton}
                    skeleton={<div className="skeleton-shimmer h-[10px] w-[66px] rounded-full" />}
                    delay={0.1}
                  >
                    {config && (
                      <p 
                        className="text-[12px] text-[var(--foreground)]/60"
                        style={{ letterSpacing: "0.01px" }}
                      >
                        {config.header.subtitle}
                      </p>
                    )}
                  </TransitionElement>
                </div>
              </div>
              
              {!showSkeleton && config?.header.actions && (
                <div className="flex items-center gap-1">{config.header.actions}</div>
              )}
            </div>

            {/* Body */}
            <div className={showSkeleton ? 'overflow-hidden' : ''}>
              <TransitionElement
                isLoading={showSkeleton}
                skeleton={<UniversalSkeleton />}
                delay={0.2}
              >
                {config && config.body}
              </TransitionElement>
            </div>
          </CardWrapper>
        </motion.div>
      )}
    </div>
  );
}

// Segmented control for switching between views
function SegmentedControl({
  options,
  selected,
  onChange,
}: {
  options: { id: string; label: string }[];
  selected: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="relative inline-flex p-1.5 rounded-[16px] bg-white/20 backdrop-blur-sm border border-white/30">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`
            relative z-10 px-5 py-2 rounded-[12px] text-base font-medium transition-colors duration-200
            ${
              selected === option.id
                ? "text-[#21201C]"
                : "text-white hover:text-white/80"
            }
          `}
        >
          {/* Sliding active indicator */}
          {selected === option.id && (
            <motion.div
              layoutId="segment-indicator"
              className="absolute inset-0 bg-white rounded-[12px] shadow-sm"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

// Static header label (used when headerLabel is set; no countdown)
function StaticHeader({ label }: { label: string }) {
  return (
    <div className="flex justify-center py-6 min-h-[3rem]">
      <h2 className="text-sm font-bold tracking-[1.2px] uppercase text-[var(--foreground)] font-[var(--font-era)]">
        {label}
      </h2>
    </div>
  );
}

// Arrow icon for skip button
function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

// Chat header with countdown progress ring (CSS transition based) – used when no headerLabel
function ChatHeader({
  cycleKey,
  totalDuration,
  isActive,
  onSkip,
}: {
  cycleKey: number;
  totalDuration: number;
  isActive: boolean;
  onSkip?: () => void;
}) {
  const size = 32;
  const strokeWidth = 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = isActive ? 0 : circumference;
  
  const [isHovered, setIsHovered] = useState(false);
  const [arrowState, setArrowState] = useState<"idle" | "exiting" | "entering">("idle");

  const handleClick = () => {
    if (!onSkip || arrowState !== "idle") return;
    setArrowState("exiting");
    // After exit animation, switch to entering
    setTimeout(() => {
      setArrowState("entering");
      // After enter animation, reset to idle and trigger skip
      setTimeout(() => {
        setArrowState("idle");
        onSkip();
      }, 150);
    }, 120);
  };

  return (
    <div className="flex items-center justify-center py-6">
      <button
        className={`relative flex items-center justify-center overflow-hidden ${onSkip ? "cursor-pointer" : ""}`}
        style={{ width: size, height: size }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        disabled={!onSkip}
        aria-label={onSkip ? "Skip to next conversation" : undefined}
      >
        <svg
          key={cycleKey}
          className="absolute inset-0 -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-[var(--foreground)]/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-[var(--foreground)]"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: isActive ? `stroke-dashoffset ${totalDuration}ms linear` : "none",
            }}
          />
        </svg>
        {/* Sentinel icon - scales out on hover */}
        <motion.div
          className="absolute"
          initial={false}
          animate={{ 
            opacity: isHovered && onSkip ? 0 : 1,
            scale: isHovered && onSkip ? 0 : 1,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <SentinelIcon size={16} />
        </motion.div>
        {/* Arrow icon - scales in with pop on hover, flies off/in on click */}
        {onSkip && arrowState !== "entering" && (
          <motion.div
            className="absolute"
            initial={false}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.1 : 0,
              x: arrowState === "exiting" ? 40 : 0,
            }}
            transition={{ 
              duration: arrowState === "exiting" ? 0.12 : 0.2,
              ease: arrowState === "exiting" ? [0.4, 0, 1, 1] : [0, 0, 0.2, 1.2],
            }}
          >
            <ArrowRightIcon size={18} />
          </motion.div>
        )}
        {/* Arrow entering from left after click */}
        {onSkip && arrowState === "entering" && (
          <motion.div
            className="absolute"
            initial={{ x: -40, opacity: 0, scale: 1.1 }}
            animate={{ x: 0, opacity: 1, scale: 1.1 }}
            transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
          >
            <ArrowRightIcon size={18} />
          </motion.div>
        )}
      </button>
    </div>
  );
}

// ===============================
// MAIN COMPONENT
// ===============================

type ConversationMessage = { role: "user" | "agent"; content: string };

const TYPING_DURATION = 3500;
const DISPLAY_DURATION = 4000;
const DISPLAY_DURATION_PROMPT_DESIGN = 14000; // 10s longer for prompt-design
const INITIAL_DELAY = 1200;
const CARD_LOADING_DURATION = 1500;
const FADE_OUT_DURATION = 350;
/** Delay between agent finishing a response and the user's next message appearing */
const AGENT_TO_USER_DELAY = 1500;
/** Delay between user message appearing and the "thinking..." indicator */
const USER_TO_TYPING_DELAY = 800;
const TOTAL_CYCLE_DURATION =
  INITIAL_DELAY + TYPING_DURATION + CARD_LOADING_DURATION + DISPLAY_DURATION + FADE_OUT_DURATION;
const TOTAL_CYCLE_DURATION_PROMPT_DESIGN =
  INITIAL_DELAY + TYPING_DURATION + CARD_LOADING_DURATION + DISPLAY_DURATION_PROMPT_DESIGN + FADE_OUT_DURATION;

export function SummaryCardDemo({
  backgroundImage = "/images/work/sentinel/agent-bg.png",
  backgroundPosition = "center",
  headerLabel,
  variant = "sentinel",
  showBackground = true,
}: {
  backgroundImage?: string;
  backgroundPosition?: string;
  headerLabel?: string;
  variant?: "sentinel" | "agentic-autofill" | "prompt-design";
  showBackground?: boolean;
} = {}) {
  // Select conversation templates based on variant
  const conversationTemplates = variant === "sentinel" 
    ? sentinelConversationTemplates 
    : variant === "prompt-design"
    ? promptDesignConversationTemplates as ConversationTemplate[]
    : agenticAutofillConversationTemplates;
  
  // For prompt-design variant, get guidelines
  const promptDesignTemplates = variant === "prompt-design" ? promptDesignConversationTemplates : null;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(currentIndex);
  const template = conversationTemplates[currentIndex];

  const [showAgentResponse, setShowAgentResponse] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const [cycleKey, setCycleKey] = useState(0);
  const [isProgressActive, setIsProgressActive] = useState(false);

  // Single conversation thread (when headerLabel – append instead of replace)
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAgentContent, setCurrentAgentContent] = useState("");
  const [activeSegment, setActiveSegment] = useState<"problem" | "solution">("problem");
  const [isShaking, setIsShaking] = useState(false);

  // Solution conversation state (step-based)
  type SolutionDisplayItem = 
    | { type: "user"; content: string }
    | { type: "agent"; content: string };
  
  const [solutionDisplayItems, setSolutionDisplayItems] = useState<SolutionDisplayItem[]>([]);
  const [solutionStepIndex, setSolutionStepIndex] = useState(0);
  const [solutionCurrentWorking, setSolutionCurrentWorking] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [solutionCurrentAgentTyping, setSolutionCurrentAgentTyping] = useState<string | null>(null);
  const [solutionIsTyping, setSolutionIsTyping] = useState(false);
  const [solutionIsExiting, setSolutionIsExiting] = useState(false);
  
  // Prompt design guideline state
  const [currentGuideline, setCurrentGuideline] = useState<{ title: string; description: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const advanceLockRef = useRef(false);
  const solutionStepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const segmentChangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solutionStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const advanceToNextStep = useCallback(() => {
    if (advanceLockRef.current) return;
    advanceLockRef.current = true;

    const contentToPush = currentAgentContent;
    setConversationMessages((prev) => {
      const last = prev[prev.length - 1];
      if (
        last?.role === "agent" &&
        last?.content === contentToPush
      ) {
        return prev;
      }
      return [...prev, { role: "agent", content: contentToPush }];
    });
    setShowAgentResponse(false);
    setCurrentStep((step) => {
      const next = step + 1;
      if (next < conversationTemplates.length) {
        const nextUserContent = conversationTemplates[next].question;
        setTimeout(() => {
          setConversationMessages((prev) => {
            const last = prev[prev.length - 1];
            if (
              last?.role === "user" &&
              last?.content === nextUserContent
            ) {
              return prev;
            }
            return [...prev, { role: "user", content: nextUserContent }];
          });
          advanceLockRef.current = false;
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              setShowAgentResponse(true);
              setCurrentAgentContent(conversationTemplates[next].response);
            }, TYPING_DURATION);
          }, USER_TO_TYPING_DELAY);
        }, AGENT_TO_USER_DELAY);
        return next;
      }
      // Shake the chat window when conversation finishes (after delay)
      setTimeout(() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }, 1000);

      // Replay from start after a pause
      setTimeout(() => {
        setConversationMessages([{ role: "user", content: conversationTemplates[0].question }]);
        setCurrentStep(0);
        advanceLockRef.current = false;
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setShowAgentResponse(true);
            setCurrentAgentContent(conversationTemplates[0].response);
          }, TYPING_DURATION);
        }, USER_TO_TYPING_DELAY);
      }, DISPLAY_DURATION);
      return 0;
    });
  }, [currentAgentContent]);

  const startConversation = useCallback(() => {
    if (headerLabel) {
      const delay = 400;
      setTimeout(() => {
        setConversationMessages([{ role: "user", content: conversationTemplates[0].question }]);
        setCurrentStep(0);
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setShowAgentResponse(true);
            setCurrentAgentContent(conversationTemplates[0].response);
          }, TYPING_DURATION);
        }, USER_TO_TYPING_DELAY);
      }, delay);
    } else {
      // Default cycling behavior for other variants (including prompt-design)
      // Clear any pending cycle timeouts
      cycleTimeoutsRef.current.forEach(clearTimeout);
      cycleTimeoutsRef.current = [];
      
      // Read index from ref to always get latest value
      const cycleIndex = currentIndexRef.current;
      setCycleKey((prev) => prev + 1);
      requestAnimationFrame(() => setIsProgressActive(true));
      
      const t1 = setTimeout(() => {
        setIsTyping(true);
        const t2 = setTimeout(() => {
          setIsTyping(false);
          setShowAgentResponse(true);
          // Show guideline if prompt-design variant has one for current template
          if (promptDesignTemplates) {
            const currentTemplate = promptDesignTemplates[cycleIndex];
            if (currentTemplate?.guideline) {
              const guideline = currentTemplate.guideline;
              const tGuideline = setTimeout(() => setCurrentGuideline(guideline), 3500);
              cycleTimeoutsRef.current.push(tGuideline);
            }
          }
          setIsCardLoading(true);
          const t3 = setTimeout(() => {
            setIsCardLoading(false);
            // Use longer display duration for prompt-design variant
            const displayDuration = variant === "prompt-design" ? DISPLAY_DURATION_PROMPT_DESIGN : DISPLAY_DURATION;
            const t4 = setTimeout(() => {
              setIsExiting(true);
              setCurrentGuideline(null); // Clear guideline before cycling
              const t5 = setTimeout(() => {
                setIsProgressActive(false);
                setShowAgentResponse(false);
                const nextIndex = (cycleIndex + 1) % conversationTemplates.length;
                // Update both state and ref
                currentIndexRef.current = nextIndex;
                setCurrentIndex(nextIndex);
                setIsExiting(false);
                // Call startConversation again (ref reads latest index)
                startConversation();
              }, FADE_OUT_DURATION);
              cycleTimeoutsRef.current.push(t5);
            }, displayDuration);
            cycleTimeoutsRef.current.push(t4);
          }, CARD_LOADING_DURATION);
          cycleTimeoutsRef.current.push(t3);
        }, TYPING_DURATION);
        cycleTimeoutsRef.current.push(t2);
      }, INITIAL_DELAY);
      cycleTimeoutsRef.current.push(t1);
    }
  }, [headerLabel, promptDesignTemplates, conversationTemplates.length, variant]);

  // Skip to next conversation (for manual navigation)
  const skipToNext = useCallback(() => {
    // Clear all pending cycle timeouts
    cycleTimeoutsRef.current.forEach(clearTimeout);
    cycleTimeoutsRef.current = [];
    
    // Clear current state
    setCurrentGuideline(null);
    setShowAgentResponse(false);
    setIsTyping(false);
    setIsCardLoading(false);
    setIsExiting(false);
    setIsProgressActive(false);
    
    // Advance to next index
    const nextIndex = (currentIndexRef.current + 1) % conversationTemplates.length;
    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
    
    // Start new conversation
    startConversation();
  }, [conversationTemplates.length, startConversation]);

  // Process solution step
  const processSolutionStep = useCallback((stepIndex: number) => {
    if (stepIndex >= solutionSteps.length) {
      // Replay from start after a pause - animate out first, then reset
      solutionStepTimeoutRef.current = setTimeout(() => {
        // Start exit animation
        setSolutionIsExiting(true);
        
        // After exit animation completes, reset and start fresh
        solutionStepTimeoutRef.current = setTimeout(() => {
          setSolutionDisplayItems([]);
          setSolutionCurrentWorking(null);
          setShowAuthModal(false);
          setSolutionCurrentAgentTyping(null);
          setSolutionIsExiting(false);
          setSolutionStepIndex(0);
          processSolutionStep(0);
        }, 300); // Exit animation duration
      }, DISPLAY_DURATION);
      return;
    }

    const step = solutionSteps[stepIndex];

    switch (step.type) {
      case "user-message":
        setSolutionDisplayItems(prev => [...prev, { type: "user", content: step.content! }]);
        solutionStepTimeoutRef.current = setTimeout(() => {
          setSolutionStepIndex(stepIndex + 1);
          processSolutionStep(stepIndex + 1);
        }, USER_TO_TYPING_DELAY);
        break;

      case "agent-message":
        // Show typing indicator first
        setSolutionIsTyping(true);
        solutionStepTimeoutRef.current = setTimeout(() => {
          setSolutionIsTyping(false);
          setSolutionCurrentAgentTyping(step.content!);
        }, TYPING_DURATION);
        break;

      case "agent-working":
        setSolutionCurrentWorking(step.content!);
        solutionStepTimeoutRef.current = setTimeout(() => {
          // Clear working and move to next step (don't accumulate in display)
          setSolutionCurrentWorking(null);
          setSolutionStepIndex(stepIndex + 1);
          processSolutionStep(stepIndex + 1);
        }, step.duration || 1500);
        break;

      case "permission-card":
        setShowAuthModal(true);
        // Don't auto-advance - wait for user action
        break;

      case "user-action":
        // This is handled by the authorize callback
        break;
    }
  }, []);

  // Called when agent message finishes typing
  const onSolutionAgentTypingComplete = useCallback(() => {
    const currentContent = solutionCurrentAgentTyping;
    if (currentContent) {
      setSolutionDisplayItems(prev => [...prev, { type: "agent", content: currentContent }]);
      setSolutionCurrentAgentTyping(null);
      const nextStep = solutionStepIndex + 1;
      setSolutionStepIndex(nextStep);
      setTimeout(() => processSolutionStep(nextStep), 500);
    }
  }, [solutionCurrentAgentTyping, solutionStepIndex, processSolutionStep]);

  // Called when user clicks authorize on permission card
  const onSolutionAuthorize = useCallback(() => {
    setShowAuthModal(false);
    // Advance past permission-card and user-action steps after exit animation
    const nextStep = solutionStepIndex + 2;
    setSolutionStepIndex(nextStep);
    setTimeout(() => processSolutionStep(nextStep), 300); // Delay for exit animation
  }, [solutionStepIndex, processSolutionStep]);

  // Start solution conversation
  const startSolutionConversation = useCallback(() => {
    // Clear any existing start timeout
    if (solutionStartTimeoutRef.current) {
      clearTimeout(solutionStartTimeoutRef.current);
    }
    const delay = 400;
    solutionStartTimeoutRef.current = setTimeout(() => {
      solutionStartTimeoutRef.current = null;
      setSolutionStepIndex(0);
      processSolutionStep(0);
    }, delay);
  }, [processSolutionStep]);

  // Handle segment change - reset and restart conversation from scratch
  const handleSegmentChange = useCallback((newSegment: "problem" | "solution") => {
    if (newSegment === activeSegment) return;
    
    // Clear ALL active timeouts to prevent any pending operations
    if (solutionStepTimeoutRef.current) {
      clearTimeout(solutionStepTimeoutRef.current);
      solutionStepTimeoutRef.current = null;
    }
    if (solutionStartTimeoutRef.current) {
      clearTimeout(solutionStartTimeoutRef.current);
      solutionStartTimeoutRef.current = null;
    }
    if (segmentChangeTimeoutRef.current) {
      clearTimeout(segmentChangeTimeoutRef.current);
      segmentChangeTimeoutRef.current = null;
    }
    
    // Reset problem conversation state
    setConversationMessages([]);
    setCurrentStep(0);
    setCurrentAgentContent("");
    setIsTyping(false);
    setShowAgentResponse(false);
    setIsShaking(false);
    advanceLockRef.current = false;
    
    // Reset solution conversation state
    setSolutionDisplayItems([]);
    setSolutionStepIndex(0);
    setSolutionCurrentWorking(null);
    setSolutionCurrentAgentTyping(null);
    setSolutionIsTyping(false);
    setSolutionIsExiting(false);
    setShowAuthModal(false);
    
    // Switch segment
    setActiveSegment(newSegment);
    
    // Start the appropriate conversation fresh after animation completes
    segmentChangeTimeoutRef.current = setTimeout(() => {
      segmentChangeTimeoutRef.current = null;
      if (newSegment === "problem") {
        startConversation();
      } else {
        startSolutionConversation();
      }
    }, 350); // Wait for exit animation
  }, [activeSegment, startConversation, startSolutionConversation]);

  // Trigger first conversation when component enters viewport
  useEffect(() => {
    if (hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          startConversation();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTriggered]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden ${showBackground ? "p-3 sm:p-6 md:p-8 lg:p-12 xl:p-16" : ""}`}
    >
      {/* Background image - optimized by Next.js */}
      {showBackground && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: backgroundPosition }}
          sizes="100vw"
        />
      )}
      {/* Segmented control above chat window */}
      {headerLabel && (
        <div className="relative z-10 flex justify-center mb-4">
          <SegmentedControl
            options={[
              { id: "problem", label: "Problem" },
              { id: "solution", label: "Solution" },
            ]}
            selected={activeSegment}
            onChange={(id) => handleSegmentChange(id as "problem" | "solution")}
          />
        </div>
      )}

      {/* Container for chat + absolutely positioned guideline */}
      <div className="relative z-10 w-full">
      <div className="flex justify-center">
      {/* Chat window wrapper - backdrop blur when showBackground, simple border otherwise */}
      <motion.div
        className={showBackground 
          ? "relative rounded-[16px] p-2 backdrop-blur-md border border-white/30"
          : "relative overflow-hidden"
        }
        style={{ 
          backgroundColor: showBackground ? "rgba(255, 255, 255, 0.3)" : undefined,
          maxWidth: "416px",
          width: "100%",
          willChange: "transform",
        }}
        animate={
          isShaking
            ? {
                x: [0, -6, 6, -5, 5, -3, 3, -1, 1, 0],
                transition: { duration: 0.5, ease: "easeInOut" },
              }
            : { x: 0 }
        }
      >
        {/* Inner container - uses theme colors */}
        <div 
          className={showBackground 
            ? "rounded-[12px] overflow-hidden flex flex-col h-[660px] bg-[var(--background)]"
            : "rounded-[12px] overflow-hidden flex flex-col h-[660px] bg-[var(--background)] border border-[var(--border-darker)]"
          }
        >
      {/* Header: static title when headerLabel set, else countdown */}
      {headerLabel ? (
        <StaticHeader 
          label={activeSegment === "problem" ? headerLabel : "The solution"} 
          key={activeSegment}
        />
      ) : (
        <ChatHeader
          cycleKey={cycleKey}
          totalDuration={variant === "prompt-design" ? TOTAL_CYCLE_DURATION_PROMPT_DESIGN : TOTAL_CYCLE_DURATION}
          isActive={isProgressActive}
          onSkip={skipToNext}
        />
      )}

      {/* Messages area */}
      <div
        className="px-4 pb-6 overflow-y-auto"
        style={{ minHeight: "500px", transform: "translateZ(0)" }}
      >
        <AnimatePresence mode="wait">
          {headerLabel && activeSegment === "problem" ? (
            <motion.div
              key="problem-conversation"
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Problem: Accumulated conversation (no history removed) */}
              {conversationMessages.map((m, i) =>
                m.role === "user" ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <UserBubble content={m.content} />
                  </motion.div>
                ) : (
                  <div key={i}>
                    <AgentBubble content={m.content} staticContent />
                  </div>
                )
              )}
              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <TypingIndicator />
                </motion.div>
              )}
              {showAgentResponse && (
                <motion.div
                  key={`agent-${currentStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <AgentBubble
                    content={currentAgentContent}
                    cardType={conversationTemplates[currentStep]?.cardType}
                    isCardLoading={false}
                    onTypingComplete={advanceToNextStep}
                  />
                </motion.div>
              )}
            </motion.div>
          ) : headerLabel && activeSegment === "solution" ? (
            <motion.div
              key="solution-conversation"
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: solutionIsExiting ? 0 : 1, 
                y: solutionIsExiting ? -10 : 0 
              }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Solution: Step-based conversation */}
              {solutionDisplayItems.map((item, i) => {
                if (item.type === "user") {
                  return (
                    <motion.div
                      key={`user-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <UserBubble content={item.content} />
                    </motion.div>
                  );
                }
                if (item.type === "agent") {
                  return (
                    <div key={`agent-${i}`}>
                      <AgentBubble content={item.content} staticContent />
                    </div>
                  );
                }
                return null;
              })}
              {/* Current working indicator */}
              {solutionCurrentWorking && (
                <motion.div
                  key="working-current"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <WorkingIndicator text={solutionCurrentWorking} />
                </motion.div>
              )}
              {/* Typing indicator */}
              {solutionIsTyping && (
                <motion.div
                  key="typing-solution"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                <TypingIndicator />
              </motion.div>
            )}
            {/* Agent typing out message */}
            {solutionCurrentAgentTyping && (
              <motion.div
                key={`agent-typing-${solutionStepIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <AgentBubble
                  content={solutionCurrentAgentTyping}
                  onTypingComplete={onSolutionAgentTypingComplete}
                />
              </motion.div>
            )}
            </motion.div>
          ) : (
            <motion.div
              key="default-conversation"
              className="flex flex-col gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <UserBubble content={template?.question ?? ""} />
              <AnimatePresence mode="wait">
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TypingIndicator />
                  </motion.div>
                )}
                {showAgentResponse && template && (
                  <motion.div
                    key={`response-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AgentBubble
                      content={template.response}
                      cardType={template.cardType}
                      isCardLoading={isCardLoading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
      </motion.div>
      </div>
      
      {/* Absolutely positioned guideline card for prompt-design variant */}
      {variant === "prompt-design" && (
        <div className="hidden lg:block absolute left-[calc(50%+220px)] top-[120px]">
          <AnimatePresence>
            {currentGuideline && (
              <PromptGuidelineCard 
                title={currentGuideline.title} 
                description={currentGuideline.description} 
              />
            )}
          </AnimatePresence>
        </div>
      )}
      
      </div>
      
      {/* Authorization Modal Overlay */}
      {headerLabel && (
        <AuthorizationModal 
          isOpen={showAuthModal} 
          onAuthorize={onSolutionAuthorize} 
        />
      )}
    </div>
  );
}
