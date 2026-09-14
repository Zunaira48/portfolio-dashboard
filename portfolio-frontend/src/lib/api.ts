const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5216";

export interface Profile {
  fullName: string;
  titles: string[];
  heroDescription: string;
  aboutDescription: string;
  location: string;
  profileImageUrl: string | null;
  resumeUrl: string | null;
  contactEmail: string;
  availabilityStatus: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string | null;
  imageAlt: string | null;
  gitHubUrl: string | null;
  liveUrl: string | null;
  category: string;
  featured: boolean;
  technologies: string[];
  galleryUrls: string[];
}

export interface SkillCategory {
  name: string;
  skills: { name: string; iconKey: string | null; proficiency: number | null }[];
}

export interface Experience {
  jobTitle: string;
  company: string;
  location: string | null;
  employmentType: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  responsibilities: string;
  technologies: string[];

}

export interface Education {
  degree: string;
  institution: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  specialization: string | null;
  description: string | null;
}

export interface Certification {
  title: string;
  issuer: string | null;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
  description: string | null;
}

export interface SocialLink {
  platform: string;
  url: string;
  iconKey: string | null;
}

export interface BlogPostSummary {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  tags: string[];
  publishedAt: string | null;
}

export interface BlogPostDetail {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  tags: string[];
  publishedAt: string | null;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getSiteSettings: () => apiFetch<Record<string, string>>("/api/site-settings"),
  getBlogPosts: () => apiFetch<BlogPostSummary[]>("/api/blog"),
  getBlogPostBySlug: (slug: string) => apiFetch<BlogPostDetail>(`/api/blog/${slug}`),
  getProfile: () => apiFetch<Profile>("/api/profile"),
  getProjects: () => apiFetch<Project[]>("/api/projects"),
  getProjectBySlug: (slug: string) => apiFetch<Project>(`/api/projects/${slug}`),
  getSkills: () => apiFetch<SkillCategory[]>("/api/skills"),
  getExperience: () => apiFetch<Experience[]>("/api/experience"),
  getEducation: () => apiFetch<Education[]>("/api/education"),
  getCertifications: () => apiFetch<Certification[]>("/api/certifications"),
  getSocialLinks: () => apiFetch<SocialLink[]>("/api/social-links"),
  submitContact: (data: { name: string; email: string; subject?: string; message: string }) =>
    apiFetch<{ success: boolean; message: string }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
