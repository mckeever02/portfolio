import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCaseStudy, getAllCaseStudySlugs } from "@/data/case-studies";
import { VerifierContent } from "./CaseStudyContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    };
  }

  const ogImage = caseStudy.heroVideoPoster || caseStudy.heroImage;

  return {
    title: `${caseStudy.title} | Michael McKeever`,
    description: caseStudy.subtitle,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.subtitle,
      type: "article",
      images: ogImage ? [{ url: ogImage, width: 1800, height: 1110 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.title,
      description: caseStudy.subtitle,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  // Route to specific content based on slug
  if (slug === "verifier") {
    return <VerifierContent caseStudy={caseStudy} />;
  }

  // Fallback for unknown slugs
  notFound();
}
