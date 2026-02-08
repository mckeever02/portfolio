"use client";

import { CaseStudy } from "@/data/case-studies";
import {
  CaseStudyLayout,
  NarrowContent,
  BodyText,
  LargeText,
  ContentSection,
} from "@/components/case-study";
import { SkewedTag } from "@/components/SkewedTag";

interface ItemCreationContentProps {
  caseStudy: CaseStudy;
}

export function ItemCreationContent({ caseStudy }: ItemCreationContentProps) {
  return (
    <CaseStudyLayout caseStudy={caseStudy}>
      <NarrowContent>
        <ContentSection id="overview" title="Overview">
        <BodyText>
          In 2023, I joined the Product Led Growth team at 1Password and was tasked with discovering and improving  poor experiences across our products. One of those tasks was improving the experience of creating items within the 1Password Desktop and Mobile apps. 
        </BodyText>
        </ContentSection>
      </NarrowContent>
    </CaseStudyLayout>
  );
}
