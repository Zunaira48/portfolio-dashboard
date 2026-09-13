"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { adminApi, type AdminBlogPost } from "@/lib/adminApi";
import type { FieldConfig, FormValues } from "@/components/admin/AdminFormModal";

const fields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true, helpText: "URL-friendly, e.g. my-post-title" },
  { name: "excerpt", label: "Excerpt", type: "textarea", required: true, helpText: "Short summary shown on the blog list" },
  { name: "content", label: "Content", type: "richtext", required: true },
  { name: "coverImageUrl", label: "Cover Image URL", type: "text", helpText: "Paste a Cloudinary URL from the Media page" },
  { name: "tags", label: "Tags", type: "tags" },
  { name: "published", label: "Published (visible on public site)", type: "checkbox" },
];

const emptyValues: FormValues = {
  title: "", slug: "", excerpt: "", content: "", coverImageUrl: "", tags: [], published: true,
};

function toFormValues(row: AdminBlogPost): FormValues {
  return {
    title: row.title, slug: row.slug, excerpt: row.excerpt, content: row.content,
    coverImageUrl: row.coverImageUrl ?? "", tags: row.tags, published: row.published,
  };
}

export default function AdminBlogPage() {
  return (
    <ResourceManager<AdminBlogPost>
      title="Blog Posts"
      description="Manage the articles shown on your public blog."
      fields={fields}
      emptyValues={emptyValues}
      toFormValues={toFormValues}
      listFn={adminApi.getBlogPosts}
      createFn={adminApi.createBlogPost}
      updateFn={adminApi.updateBlogPost}
      deleteFn={adminApi.deleteBlogPost}
      columns={[
        { key: "title", label: "Title" },
        { key: "published", label: "Status", render: (r) => (r.published ? <span className="badge">Published</span> : <span className="text-text-muted text-xs">Draft</span>) },
        { key: "publishedAt", label: "Published", render: (r) => (r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : "—") },
      ]}
    />
  );
}