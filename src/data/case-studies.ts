export interface TeamMember {
  name: string;
  avatar: string;
}

export interface CaseStudySection {
  id: string;
  title: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  company: string;
  subtitle: string;
  heroColor: string;
  heroImage?: string;
  timeline: string;
  role: string;
  team: TeamMember[];
  sections: CaseStudySection[];
  protected?: boolean;
}

export const caseStudies: Record<string, CaseStudy> = {
  sentinel: {
    slug: "sentinel",
    title: "Sentinel",
    company: "1Password",
    subtitle: "Bringing agentic intelligence to the 1Password admin experience",
    heroColor: "#2a1f5c",
    heroImage: "/images/sentinel-hero.mp4",
    timeline: "Q4 2025",
    role: "Design Lead",
    team: [],
    sections: [],
    protected: true,
  },
  verifier: {
    slug: "verifier",
    title: "Verifier",
    company: "1Password",
    subtitle: "Identity verification in the age of AI fraud and deepfakes",
    heroColor: "#c9e8e3",
    heroImage: "/images/verifier-hero.jpg",
    timeline: "H1 2025",
    role: "Lead Designer",
    team: [
      { name: "Michael", avatar: "/images/michael-mckeever.jpg" },
      { name: "Danny", avatar: "/images/work/verifier/danny.jpg" },
      { name: "Gennadiy", avatar: "/images/work/verifier/gennadiy.jpg" },
      { name: "Ben", avatar: "/images/work/verifier/ben.jpg" },
      { name: "Mitch", avatar: "/images/work/verifier/mitch.jpg" },
      { name: "Shiner", avatar: "/images/work/verifier/shiner.jpg" },
    ],
    sections: [
      { id: "overview", title: "Overview" },
      { id: "hackathon", title: "The hackathon" },
      { id: "problem", title: "The problem" },
      { id: "why-1password", title: "Why 1Password?" },
      { id: "usecases", title: "Defining usecases" },
      { id: "wireframing", title: "Wireframing the flow" },
      { id: "flow", title: "The flow" },
      { id: "rsa", title: "RSA San Francisco 2025" },
    ],
    protected: true,
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function getAllCaseStudySlugs(): string[] {
  return Object.keys(caseStudies);
}
