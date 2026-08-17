"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { adminApi, type AdminCertification } from "@/lib/adminApi";
import type { FieldConfig, FormValues } from "@/components/admin/AdminFormModal";

const fields: FieldConfig[] = [
  { name: "title", label: "Certificate Title", type: "text", required: true },
  { name: "issuer", label: "Issuing Organization", type: "text" },
  { name: "issueDate", label: "Issue Date", type: "text", required: true },
  { name: "expiryDate", label: "Expiry Date", type: "text" },
  { name: "credentialId", label: "Credential ID", type: "text" },
  { name: "credentialUrl", label: "Credential URL", type: "text" },
  { name: "imageUrl", label: "Certificate Image URL", type: "text", helpText: "Paste a Cloudinary URL from the Media page" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "displayOrder", label: "Display Order", type: "number" },
  { name: "published", label: "Published (visible on public site)", type: "checkbox" },
];

const emptyValues: FormValues = {
  title: "", issuer: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "",
  imageUrl: "", description: "", displayOrder: 0, published: true,
};

function toFormValues(row: AdminCertification): FormValues {
  return {
    title: row.title, issuer: row.issuer ?? "", issueDate: row.issueDate, expiryDate: row.expiryDate ?? "",
    credentialId: row.credentialId ?? "", credentialUrl: row.credentialUrl ?? "", imageUrl: row.imageUrl ?? "",
    description: row.description ?? "", displayOrder: row.displayOrder, published: row.published,
  };
}

export default function AdminCertificationsPage() {
  return (
    <ResourceManager<AdminCertification>
      title="Certifications"
      description="Manage your certifications and credentials."
      fields={fields}
      emptyValues={emptyValues}
      toFormValues={toFormValues}
      listFn={adminApi.getCertifications}
      createFn={adminApi.createCertification}
      updateFn={adminApi.updateCertification}
      deleteFn={adminApi.deleteCertification}
      columns={[
        { key: "title", label: "Title" },
        { key: "issuer", label: "Issuer", render: (r) => r.issuer ?? "—" },
        { key: "issueDate", label: "Issue Date" },
      ]}
    />
  );
}
