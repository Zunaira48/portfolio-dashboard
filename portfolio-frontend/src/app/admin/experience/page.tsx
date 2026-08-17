"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { adminApi, type AdminExperience } from "@/lib/adminApi";
import type { FieldConfig, FormValues } from "@/components/admin/AdminFormModal";

const fields: FieldConfig[] = [
  { name: "jobTitle", label: "Job Title", type: "text", required: true },
  { name: "company", label: "Company", type: "text", required: true },
  { name: "location", label: "Location", type: "text" },
  { name: "employmentType", label: "Employment Type", type: "text", helpText: "e.g. Full-time, Internship" },
  { name: "startDate", label: "Start Date", type: "text", required: true, helpText: "e.g. 09/2023" },
  { name: "endDate", label: "End Date", type: "text", helpText: "Leave blank if current" },
  { name: "isCurrent", label: "Currently working here", type: "checkbox" },
  { name: "responsibilities", label: "Responsibilities", type: "lines", helpText: "One responsibility per line" },
  { name: "technologies", label: "Technologies", type: "tags" },
  { name: "displayOrder", label: "Display Order", type: "number" },
  { name: "published", label: "Published (visible on public site)", type: "checkbox" },
];

const emptyValues: FormValues = {
  jobTitle: "", company: "", location: "", employmentType: "", startDate: "", endDate: "",
  isCurrent: false, responsibilities: [], technologies: [], displayOrder: 0, published: true,
};

function toFormValues(row: AdminExperience): FormValues {
  return {
    jobTitle: row.jobTitle, company: row.company, location: row.location ?? "", employmentType: row.employmentType ?? "",
    startDate: row.startDate, endDate: row.endDate ?? "", isCurrent: row.isCurrent,
    responsibilities: row.responsibilities, technologies: row.technologies.map((t) => t.name),
    displayOrder: row.displayOrder, published: row.published,
  };
}

export default function AdminExperiencePage() {
  return (
    <ResourceManager<AdminExperience>
      title="Experience"
      description="Manage your professional experience timeline."
      fields={fields}
      emptyValues={emptyValues}
      toFormValues={toFormValues}
      listFn={adminApi.getExperience}
      createFn={adminApi.createExperience}
      updateFn={adminApi.updateExperience}
      deleteFn={adminApi.deleteExperience}
      columns={[
        { key: "jobTitle", label: "Job Title" },
        { key: "company", label: "Company" },
        { key: "startDate", label: "Dates", render: (r) => `${r.startDate} — ${r.isCurrent ? "Present" : r.endDate}` },
      ]}
    />
  );
}
