export interface TeamMember {
  name: string;
  role: string;
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
    heroVideo: "/images/pilgrim-card-hero.mp4",
    heroVideoPoster: "/images/pilgrim-card-hero.jpg",
    timeline: "",
    role: "",
    team: [],
    sections: [],
  },
  sentinel: {
    slug: "sentinel",
    title: "1Password Sentinel",
    company: "1Password",
    subtitle: "Bringing agentic intelligence to the 1Password admin experience",
    description: "Designed and championed an agentic vision to make 1Password security as simple as a conversation.",
    heroColor: "#2a1f5c",
    heroVideo: "/images/work/sentinel/sentinel-card-hero.mp4",
    heroVideoPoster: "/images/work/sentinel/sentinel-card-hero.jpg",
    timeline: "Q4 2025",
    role: "Design Lead",
    team: [],
    sections: [
      { id: "overview", title: "Overview" },
      { id: "comparative-audit", title: "Comparative audit" },
      { id: "admin-pain-points", title: "Admin pain points" },
      { id: "solution", title: "Solution" },
      { id: "vibe-coding", title: "Vibe-coding" },
      { id: "agentic-ui", title: "Agentic UI" },
      { id: "user-testing", title: "User Testing" },
      { id: "storytelling", title: "Storytelling" },
    ],
    protected: true,
  },
  "agentic-autofill": {
    slug: "agentic-autofill",
    title: "Autofill for AI Agents",
    company: "1Password",
    subtitle: "Bringing 1Password's security to AI agents",
    description: "Led the design for a brand new experience that allows AI agents to authenticate and act online using 1Password.",
    heroColor: "#DD4825",
    heroVideo: "/images/work/agentic-autofill/agentic-autofill-project-hero.mp4",
    heroVideoPoster: "/images/agentic-autofill-card-hero.jpg",
    timeline: "2025",
    role: "Design Lead",
    team: [
      { name: "Michael", role: "Design Lead", avatar: "/images/michael-mckeever-pixel-portrait-4.png" },
      { name: "Dennis", role: "Product Lead", avatar: "/images/team/dennis.jpg" },
      { name: "Marta", role: "Research Lead", avatar: "/images/team/marta.jpg" },
      { name: "Simon", role: "Engineering Manager", avatar: "/images/team/simon.jpg" },
      { name: "Horia", role: "Engineering", avatar: "/images/team/horia.jpg" },
      { name: "Marton", role: "Engineering", avatar: "/images/team/marton.jpg" },
      { name: "Omar", role: "Engineering", avatar: "/images/team/omar.jpg" },
    ],
    sections: [
      { id: "overview", title: "Overview" },
      { id: "the-problem", title: "The problem" },
      { id: "research", title: "Research Insights" },
    ],
  },
  verifier: {
    slug: "verifier",
    title: "1Password Verifier",
    company: "1Password",
    subtitle: "Identity verification in the age of AI fraud and deepfakes",
    description: "Designed a 0 → 1 verification experience to help people prove their identities in the age of deepfakes and AI fraud.",
    heroColor: "#c9e8e3",
    heroVideo: "/images/verifier-card-hero.mp4",
    heroVideoPoster: "/images/verifier-card-hero.png",
    timeline: "H1 2025",
    role: "Lead Designer",
    team: [
      { name: "Michael", role: "Design Lead", avatar: "/images/michael-mckeever-pixel-portrait-4.png" },
      { name: "Danny", role: "Sr PM", avatar: "/images/team/danny.jpg" },
      { name: "Julie", role: "Research Lead", avatar: "/images/team/julie.jpg" },
      { name: "Gennadiy", role: "Engineering Lead", avatar: "/images/team/gennadiy.jpg" },
      { name: "Ben", role: "Engineering", avatar: "/images/team/ben.jpg" },
      { name: "Mitch", role: "Product Lead", avatar: "/images/team/mitch.jpg" },
    ],
    sections: [
      { id: "overview", title: "Overview" },
      { id: "usecases", title: "Usecases" },
      { id: "wireframing", title: "Wireframing" },
      { id: "high-fidelity", title: "High-fidelity prototype" },
      { id: "rsa", title: "RSA 2025" },
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

// Define explicit order for navigation
const caseStudyOrder = ["pilgrim", "sentinel", "agentic-autofill", "verifier"];

export function getAdjacentCaseStudies(currentSlug: string): {
  prev: CaseStudy | null;
  next: CaseStudy | null;
} {
  const currentIndex = caseStudyOrder.indexOf(currentSlug);
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: currentIndex > 0 ? caseStudies[caseStudyOrder[currentIndex - 1]] : null,
    next: currentIndex < caseStudyOrder.length - 1 ? caseStudies[caseStudyOrder[currentIndex + 1]] : null,
  };
}
