import { Metadata } from "next";
import { getCaseStudy } from "@/data/case-studies";
import { SentinelContent } from "./SentinelContent";
import { notFound } from "next/navigation";

const caseStudy = getCaseStudy("sentinel");

export const metadata: Metadata = caseStudy ? {
  title: `${caseStudy.title} | Michael McKeever`,
  description: caseStudy.subtitle,
  openGraph: {
    title: caseStudy.title,
    description: caseStudy.subtitle,
    type: "article",
    images: caseStudy.heroVideoPoster ? [{ url: caseStudy.heroVideoPoster, width: 1800, height: 1110 }] : [],
  },
  twitter: {
    card: "summary_large_image",
    title: caseStudy.title,
    description: caseStudy.subtitle,
    images: caseStudy.heroVideoPoster ? [caseStudy.heroVideoPoster] : [],
    },
} : {
  title: "Case Study Not Found",
};

export default function SentinelPage() {
  if (!caseStudy) {
    notFound();
  }

  return <SentinelContent caseStudy={caseStudy} />;
}
