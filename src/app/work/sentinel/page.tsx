"use client";

import { getCaseStudy } from "@/data/case-studies";
import {
  CaseStudyLayout,
  NarrowContent,
  WideContent,
  ContentSection,
  BodyText,
} from "@/components/case-study";
import { LightboxImage } from "@/components/Lightbox";
import { SpotlightCard } from "@/components/SpotlightCard";

const adminReasons = [
  {
    title: "People management",
    description: "Onboard new team members, manage permissions, handle account recovery, and maintain organizational structure.",
    iconBg: "bg-blue-500/10",
    iconColor: "rgb(59, 130, 246)",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: "Security management",
    description: "Configure security policies, enforce compliance standards, and manage authentication requirements across the organization.",
    iconBg: "bg-green-500/10",
    iconColor: "rgb(34, 197, 94)",
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Security insights",
    description: "Monitor password health, identify vulnerabilities, track breach alerts, and gain visibility into organizational security posture.",
    iconBg: "bg-orange-500/10",
    iconColor: "rgb(234, 88, 12)",
    icon: (
      <>
        <path d="M2 12h5" />
        <path d="M17 12h5" />
        <path d="M12 2v5" />
        <path d="M12 17v5" />
        <circle cx="12" cy="12" r="4" />
        <path d="m4.93 4.93 2.83 2.83" />
        <path d="m16.24 16.24 2.83 2.83" />
        <path d="m4.93 19.07 2.83-2.83" />
        <path d="m16.24 7.76 2.83-2.83" />
      </>
    ),
  },
];

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

      <NarrowContent>
        <ContentSection id="why-admins" title="Why do Admins go to the Admin console?">
          <BodyText>
            Understanding admin motivations helped us identify where an AI copilot could provide the most value.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adminReasons.map((reason) => (
            <SpotlightCard key={reason.title}>
              <div className={`w-12 h-12 rounded-lg flex items-center bg-black/3 justify-center mb-3`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {reason.icon}
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-1.5 text-[var(--foreground)] leading-tight">
                {reason.title}
              </h3>
              <p className="text-[var(--foreground)] text-lg">
                {reason.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </WideContent>
    </CaseStudyLayout>
  );
}
