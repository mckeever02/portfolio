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
  description: string;
  heroColor: string;
  heroImage?: string;
  heroVideo?: string;
  heroVideoPoster?: string;
  timeline: string;
  role: string;
  team: TeamMember[];
  sections: CaseStudySection[];
  protected?: boolean;
}

export const caseStudies: Record<string, CaseStudy> = {
  pilgrim: {
    slug: "pilgrim",
    title: "Pilgrim",
    company: "Pilgrim",
    subtitle: "",
    description: "",
    heroColor: "#000000",
    heroVideo: "/images/pilgrim-hero.mp4",
    heroVideoPoster: "/images/pilgrim-hero-poster.jpg",
    timeline: "",
    role: "",
    team: [],
    sections: [],
  },
  sentinel: {
    slug: "sentinel",
    title: "1Password Sentinel: Copilot for Admins",
    company: "1Password",
    subtitle: "Bringing agentic intelligence to the 1Password admin experience",
    description: "Designed and championed an agentic vision to make 1Password security as simple as a conversation.",
    heroColor: "#2a1f5c",
    heroVideo: "/images/work/sentinel/sentinel-hero-2352.mp4",
    heroVideoPoster: "/images/work/sentinel/sentinel-hero-2352-poster.jpg",
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
    description: "0 → 1 design for a verification system to combat deepfakes and AI fraud",
    heroColor: "#c9e8e3",
    heroVideo: "/images/verifier-hero.mp4",
    heroVideoPoster: "/images/verifier-hero-4.png",
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
