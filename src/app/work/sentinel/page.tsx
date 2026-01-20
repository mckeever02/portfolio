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
import { FlipCard, CardFace } from "@/components/FlipCard";

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
            Understanding admin motivations and their pain points helped me identify where an AI copilot could provide the most value.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      <WideContent>
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
    </CaseStudyLayout>
  );
}
