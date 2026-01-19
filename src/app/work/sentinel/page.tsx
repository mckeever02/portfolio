"use client";

import { getCaseStudy } from "@/data/case-studies";
import {
  CaseStudyLayout,
  NarrowContent,
  ContentSection,
  BodyText,
} from "@/components/case-study";
import Image from "next/image";

export default function SentinelPage() {
  const caseStudy = getCaseStudy("sentinel");

  if (!caseStudy) {
    return null;
  }

  return (
    <CaseStudyLayout caseStudy={caseStudy}>
      <NarrowContent>
        {/* Overview Section */}
        <ContentSection id="overview" title="Overview">
          <BodyText>
            Sentinel is an AI-powered admin copilot designed to help 1Password administrators manage their organization more efficiently. The project explores how conversational AI can simplify complex administrative tasks, surface insights, and reduce the cognitive load of managing enterprise security at scale.
          </BodyText>
        </ContentSection>
      </NarrowContent>

      {/* Sentinel Image */}
      <div className="mx-auto w-full max-w-[1100px] relative rounded-lg overflow-hidden shadow-md aspect-[3040/1928]">
        <Image
          src="/images/sentinel.jpg"
          alt="Sentinel AI-powered admin copilot"
          fill
          className="object-fit"
        />
      </div>
    </CaseStudyLayout>
  );
}
