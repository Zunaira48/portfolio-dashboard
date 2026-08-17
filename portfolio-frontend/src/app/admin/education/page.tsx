"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { adminApi, type AdminEducation } from "@/lib/adminApi";
import type { FieldConfig, FormValues } from "@/components/admin/AdminFormModal";

const fields: FieldConfig[] = [
  { name: "degree", label: "Degree", type: "text", required: true },
  { name: "institution", label: "Institution", type: "text", required: true },
  { name: "location", label: "Location", type: "text" },
  { name: "startDate", label: "Start Date/Year", type: "text", required: true },
  { name: "endDate", label: "End Date/Year", type: "text" },
  { name: "specialization", label: "Specialization", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "displayOrder", label: "Display Order", type: "number" },
  { name: "published", label: "Published (visible on public site)", type: "checkbox" },
];

const emptyValues: FormValues = {
  degree: "", institution: "", location: "", startDate: "", endDate: "",
  specialization: "", description: "", displayOrder: 0, published: true,
};

function toFormValues(row: AdminEducation): FormValues {
  return {
    degree: row.degree, institution: row.institution, location: row.location ?? "", startDate: row.startDate,
    endDate: row.endDate ?? "", specialization: row.specialization ?? "", description: row.description ?? "",
    displayOrder: row.displayOrder, published: row.published,
  };
}

export default function AdminEducationPage() {
  return (
    <ResourceManager<AdminEducation>
      title="Education"
      description="Manage your academic background."
      fields={fields}
      emptyValues={emptyValues}
      toFormValues={toFormValues}
      listFn={adminApi.getEducation}
      createFn={adminApi.createEducation}
      updateFn={adminApi.updateEducation}
      deleteFn={adminApi.deleteEducation}
      columns={[
        { key: "degree", label: "Degree" },
        { key: "institution", label: "Institution" },
        { key: "startDate", label: "Dates", render: (r) => `${r.startDate} — ${r.endDate ?? "Present"}` },
      ]}
    />
  );
}
