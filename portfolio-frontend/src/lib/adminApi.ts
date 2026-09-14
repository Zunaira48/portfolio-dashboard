// Admin calls go through Next.js's own domain (see next.config.ts rewrites),
// which proxies to the real backend server-side. This keeps the admin session
// cookie same-origin from the browser's perspective in production, where the
// frontend and backend live on different domains.
const API_URL = "";

export interface AdminSession {
  email: string;
  name?: string;
}

export interface AdminProjectTech {
  id: number;
  name: string;
}

export interface AdminProject {
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
  published: boolean;
  displayOrder: number;
  technologies: AdminProjectTech[];
  galleryUrls: string[];
}

export interface AdminSkillCategory {
  id: number;
  name: string;
  displayOrder: number;
  active: boolean;
  skills: AdminSkill[];
}

export interface AdminSkill {
  id: number;
  skillCategoryId: number;
  name: string;
  iconKey: string | null;
  proficiency: number | null;
  displayOrder: number;
  active: boolean;
}

export interface AdminExperience {
  id: number;
  jobTitle: string;
  company: string;
  location: string | null;
  employmentType: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  responsibilities: string;
  displayOrder: number;
  published: boolean;
  technologies: { id: number; name: string }[];
}

export interface AdminEducation {
  id: number;
  degree: string;
  institution: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  specialization: string | null;
  description: string | null;
  displayOrder: number;
  published: boolean;
}

export interface AdminCertification {
  id: number;
  title: string;
  issuer: string | null;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
  description: string | null;
  displayOrder: number;
  published: boolean;
}
export interface AdminBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
}

export interface AdminProfile {
  id: number;
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

export interface AdminSocialLink {
  id: number;
  platform: string;
  url: string;
  iconKey: string | null;
  displayOrder: number;
  active: boolean;
}

export interface AdminContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminMediaAsset {
  id: number;
  url: string;
  altText: string | null;
  type: string;
  uploadedAt: string;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ASP.NET's [ApiController] returns a ValidationProblemDetails shape on 400:
// { title, status, errors: { FieldName: ["message", ...] } }
// Conflict/Forbid responses from our controllers use { message: "..." }.
// This pulls the most useful human-readable text out of either shape.
async function extractErrorMessage(res: Response, path: string): Promise<string> {
  try {
    const body = await res.json();

    if (body?.errors && typeof body.errors === "object") {
      const messages = Object.values(body.errors as Record<string, string[]>).flat();
      if (messages.length > 0) return messages.join(" ");
    }

    if (typeof body?.message === "string") return body.message;
    if (typeof body?.title === "string") return body.title;
  } catch {
    // Response wasn't JSON (e.g. empty body) — fall through to generic message below.
  }

  if (res.status === 401) return "Your admin session has expired. Please sign in again.";
  if (res.status === 403) return "You don't have permission to perform this action.";
  if (res.status === 409) return "This item conflicts with an existing one (e.g. duplicate slug).";
  return `Request failed (${res.status}) for ${path}`;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const message = await extractErrorMessage(res, path);
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const adminApi = {
  // --- Auth ---
  verify: (idToken: string) => req<AdminSession>("/api/admin/auth/verify", { method: "POST", body: JSON.stringify({ idToken }) }),
  me: () => req<AdminSession>("/api/admin/auth/me"),
  logout: () => req<{ message: string }>("/api/admin/auth/logout", { method: "POST" }),

  // --- Projects ---
  getProjects: () => req<AdminProject[]>("/api/admin/projects"),
  createProject: (data: unknown) => req<AdminProject>("/api/admin/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: number, data: unknown) => req<void>(`/api/admin/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: number) => req<void>(`/api/admin/projects/${id}`, { method: "DELETE" }),

  // --- Skill Categories ---
  getSkillCategories: () => req<AdminSkillCategory[]>("/api/admin/skill-categories"),
  createSkillCategory: (data: unknown) => req<AdminSkillCategory>("/api/admin/skill-categories", { method: "POST", body: JSON.stringify(data) }),
  updateSkillCategory: (id: number, data: unknown) => req<void>(`/api/admin/skill-categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSkillCategory: (id: number) => req<void>(`/api/admin/skill-categories/${id}`, { method: "DELETE" }),

  // --- Skills ---
  createSkill: (data: unknown) => req<AdminSkill>("/api/admin/skills", { method: "POST", body: JSON.stringify(data) }),
  updateSkill: (id: number, data: unknown) => req<void>(`/api/admin/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSkill: (id: number) => req<void>(`/api/admin/skills/${id}`, { method: "DELETE" }),

  // --- Experience ---
  getExperience: () => req<AdminExperience[]>("/api/admin/experience"),
  createExperience: (data: unknown) => req<AdminExperience>("/api/admin/experience", { method: "POST", body: JSON.stringify(data) }),
  updateExperience: (id: number, data: unknown) => req<void>(`/api/admin/experience/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExperience: (id: number) => req<void>(`/api/admin/experience/${id}`, { method: "DELETE" }),

  // --- Education ---
  getEducation: () => req<AdminEducation[]>("/api/admin/education"),
  createEducation: (data: unknown) => req<AdminEducation>("/api/admin/education", { method: "POST", body: JSON.stringify(data) }),
  updateEducation: (id: number, data: unknown) => req<void>(`/api/admin/education/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEducation: (id: number) => req<void>(`/api/admin/education/${id}`, { method: "DELETE" }),

  // --- Certifications ---
  getCertifications: () => req<AdminCertification[]>("/api/admin/certifications"),
  createCertification: (data: unknown) => req<AdminCertification>("/api/admin/certifications", { method: "POST", body: JSON.stringify(data) }),
  updateCertification: (id: number, data: unknown) => req<void>(`/api/admin/certifications/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCertification: (id: number) => req<void>(`/api/admin/certifications/${id}`, { method: "DELETE" }),
  // --- Blog ---
  getBlogPosts: () => req<AdminBlogPost[]>("/api/admin/blog"),
  createBlogPost: (data: unknown) => req<AdminBlogPost>("/api/admin/blog", { method: "POST", body: JSON.stringify(data) }),
  updateBlogPost: (id: number, data: unknown) => req<void>(`/api/admin/blog/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBlogPost: (id: number) => req<void>(`/api/admin/blog/${id}`, { method: "DELETE" }),

  // --- Profile ---
  getProfile: () => req<AdminProfile>("/api/admin/profile"),
  updateProfile: (data: unknown) => req<void>("/api/admin/profile", { method: "PUT", body: JSON.stringify(data) }),

  // --- Social Links ---
  getSocialLinks: () => req<AdminSocialLink[]>("/api/admin/social-links"),
  createSocialLink: (data: unknown) => req<AdminSocialLink>("/api/admin/social-links", { method: "POST", body: JSON.stringify(data) }),
  updateSocialLink: (id: number, data: unknown) => req<void>(`/api/admin/social-links/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSocialLink: (id: number) => req<void>(`/api/admin/social-links/${id}`, { method: "DELETE" }),

  // --- Site Settings ---
  getSiteSettings: () => req<{ id: number; key: string; value: string }[]>("/api/admin/site-settings"),
  upsertSiteSetting: (key: string, value: string) => req<void>("/api/admin/site-settings", { method: "PUT", body: JSON.stringify({ key, value }) }),
  deleteSiteSetting: (key: string) => req<void>(`/api/admin/site-settings/${encodeURIComponent(key)}`, { method: "DELETE" }),

  // --- Contact Messages ---
  getContactMessages: (search?: string, unreadOnly?: boolean) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (unreadOnly) params.set("unreadOnly", "true");
    const qs = params.toString();
    return req<AdminContactMessage[]>(`/api/admin/contact-messages${qs ? `?${qs}` : ""}`);
  },
  markMessageRead: (id: number, isRead: boolean) => req<void>(`/api/admin/contact-messages/${id}/read?isRead=${isRead}`, { method: "PATCH" }),
  deleteMessage: (id: number) => req<void>(`/api/admin/contact-messages/${id}`, { method: "DELETE" }),

  // --- Media ---
  getMedia: () => req<AdminMediaAsset[]>("/api/admin/media"),
  uploadMedia: async (file: File, altText?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (altText) formData.append("altText", altText);
    const res = await fetch(`/api/admin/media/upload`, { method: "POST", credentials: "include", body: formData });
    if (!res.ok) throw new ApiError(res.status, await extractErrorMessage(res, "/api/admin/media/upload"));
    return res.json() as Promise<AdminMediaAsset>;
  },
  deleteMedia: (id: number) => req<void>(`/api/admin/media/${id}`, { method: "DELETE" }),
};
