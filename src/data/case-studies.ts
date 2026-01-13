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
}

export const caseStudies: Record<string, CaseStudy> = {
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
      { name: "Michael", avatar: "/images/work/verifier/team/michael.png" },
      { name: "Team Member 2", avatar: "/images/work/verifier/team/member2.png" },
      { name: "Team Member 3", avatar: "/images/work/verifier/team/member3.png" },
      { name: "Team Member 4", avatar: "/images/work/verifier/team/member4.png" },
      { name: "Team Member 5", avatar: "/images/work/verifier/team/member5.png" },
      { name: "Team Member 6", avatar: "/images/work/verifier/team/member6.png" },
    ],
    sections: [
      { id: "overview", title: "Overview" },
      { id: "problem", title: "The problem" },
      { id: "why-1password", title: "Why 1Password?" },
      { id: "usecases", title: "Defining usecases" },
      { id: "wireframing", title: "Wireframing the flow" },
      { id: "flow", title: "The flow" },
      { id: "rsa", title: "RSA San Francisco 2025" },
    ],
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function getAllCaseStudySlugs(): string[] {
  return Object.keys(caseStudies);
}
