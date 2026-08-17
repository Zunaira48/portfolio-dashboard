"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { adminApi, type AdminProject } from "@/lib/adminApi";
import type { FieldConfig, FormValues } from "@/components/admin/AdminFormModal";

const fields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true, helpText: "URL-friendly, e.g. my-project-name" },
  { name: "shortDescription", label: "Short Description", type: "textarea", required: true },
  { name: "fullDescription", label: "Full Description", type: "textarea", required: true },
  { name: "category", label: "Category", type: "text", required: true },
  { name: "technologies", label: "Technologies", type: "tags" },
  { name: "imageUrl", label: "Image URL", type: "text", helpText: "Paste a Cloudinary URL from the Media page" },
  { name: "imageAlt", label: "Image Alt Text", type: "text" },
  { name: "gitHubUrl", label: "GitHub URL", type: "text" },
  { name: "liveUrl", label: "Live Demo URL", type: "text" },
  { name: "displayOrder", label: "Display Order", type: "number" },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "published", label: "Published (visible on public site)", type: "checkbox" },
];

const emptyValues: FormValues = {
  title: "", slug: "", shortDescription: "", fullDescription: "", category: "",
  technologies: [], imageUrl: "", imageAlt: "", gitHubUrl: "", liveUrl: "",
  displayOrder: 0, featured: false, published: true,
};

function toFormValues(row: AdminProject): FormValues {
  return {
    title: row.title, slug: row.slug, shortDescription: row.shortDescription, fullDescription: row.fullDescription,
    category: row.category, technologies: row.technologies.map((t) => t.name),
    imageUrl: row.imageUrl ?? "", imageAlt: row.imageAlt ?? "", gitHubUrl: row.gitHubUrl ?? "", liveUrl: row.liveUrl ?? "",
    displayOrder: row.displayOrder, featured: row.featured, published: row.published,
  };
}

export default function AdminProjectsPage() {
  return (
    <ResourceManager<AdminProject>
      title="Projects"
      description="Manage the projects shown on your public portfolio."
      fields={fields}
      emptyValues={emptyValues}
      toFormValues={toFormValues}
      listFn={adminApi.getProjects}
      createFn={adminApi.createProject}
      updateFn={adminApi.updateProject}
      deleteFn={adminApi.deleteProject}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "published", label: "Status", render: (r) => (r.published ? <span className="badge">Published</span> : <span className="text-text-muted text-xs">Draft</span>) },
      ]}
    />
  );
}
