"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { adminApi, type AdminSocialLink } from "@/lib/adminApi";
import type { FieldConfig, FormValues } from "@/components/admin/AdminFormModal";

const fields: FieldConfig[] = [
  { name: "platform", label: "Platform", type: "text", required: true, helpText: "e.g. GitHub, LinkedIn, Twitter" },
  { name: "url", label: "URL", type: "text", required: true },
  { name: "iconKey", label: "Icon Key", type: "text", helpText: "Lowercase, e.g. github, linkedin" },
  { name: "displayOrder", label: "Display Order", type: "number" },
  { name: "active", label: "Active (visible on public site)", type: "checkbox" },
];

const emptyValues: FormValues = {
  platform: "", url: "", iconKey: "", displayOrder: 0, active: true,
};

function toFormValues(row: AdminSocialLink): FormValues {
  return {
    platform: row.platform, url: row.url, iconKey: row.iconKey ?? "",
    displayOrder: row.displayOrder, active: row.active,
  };
}

export default function AdminSocialLinksPage() {
  return (
    <ResourceManager<AdminSocialLink>
      title="Social Links"
      description="Manage the social links shown in your Hero and Footer."
      fields={fields}
      emptyValues={emptyValues}
      toFormValues={toFormValues}
      listFn={adminApi.getSocialLinks}
      createFn={adminApi.createSocialLink}
      updateFn={adminApi.updateSocialLink}
      deleteFn={adminApi.deleteSocialLink}
      columns={[
        { key: "platform", label: "Platform" },
        { key: "url", label: "URL" },
        { key: "active", label: "Status", render: (r) => (r.active ? <span className="badge">Active</span> : <span className="text-text-muted text-xs">Inactive</span>) },
      ]}
    />
  );
}