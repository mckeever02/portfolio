"use client";

import { getCaseStudy } from "@/data/case-studies";
import {
  CaseStudyLayout,
  NarrowContent,
  ContentSection,
  BodyText,
} from "@/components/case-study";

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
    </CaseStudyLayout>
  );
}
