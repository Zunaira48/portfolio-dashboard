"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminSkillCategory } from "@/lib/adminApi";
import AdminFormModal, { FieldConfig, FormValues } from "@/components/admin/AdminFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const categoryFields: FieldConfig[] = [
  { name: "name", label: "Category Name", type: "text", required: true },
  { name: "displayOrder", label: "Display Order", type: "number" },
  { name: "active", label: "Active (visible on public site)", type: "checkbox" },
];

const skillFields: FieldConfig[] = [
  { name: "name", label: "Skill Name", type: "text", required: true },
  { name: "iconKey", label: "Icon Key", type: "text", helpText: "Optional identifier for a custom icon" },
  { name: "proficiency", label: "Proficiency (0-100, optional)", type: "number" },
  { name: "displayOrder", label: "Display Order", type: "number" },
  { name: "active", label: "Active (visible on public site)", type: "checkbox" },
];

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<AdminSkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingCategory, setEditingCategory] = useState<AdminSkillCategory | "new" | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminSkillCategory | null>(null);

  const [skillModal, setSkillModal] = useState<{ categoryId: number; skill: AdminSkillCategory["skills"][number] | "new" } | null>(null);
  const [deletingSkillId, setDeletingSkillId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setCategories(await adminApi.getSkillCategories());
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    adminApi.getSkillCategories().then((skillCategories) => {
      if (!active) return;
      setCategories(skillCategories);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  async function handleCategorySubmit(values: FormValues) {
    if (editingCategory === "new") {
      await adminApi.createSkillCategory(values);
    } else if (editingCategory) {
      await adminApi.updateSkillCategory(editingCategory.id, values);
    }
    await load();
  }

  async function handleSkillSubmit(values: FormValues) {
    if (!skillModal) return;
    if (skillModal.skill === "new") {
      await adminApi.createSkill({ ...values, skillCategoryId: skillModal.categoryId });
    } else {
      await adminApi.updateSkill(skillModal.skill.id, { ...values, skillCategoryId: skillModal.categoryId });
    }
    await load();
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Skills</h1>
          <p className="text-text-muted text-sm">Manage skill categories and the skills within each.</p>
        </div>
        <button onClick={() => setEditingCategory("new")} className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold">{cat.name}</h3>
                  {!cat.active ? <span className="text-xs text-text-muted">Inactive</span> : null}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setSkillModal({ categoryId: cat.id, skill: "new" })} className="btn-secondary text-xs px-3 py-1.5">
                    + Skill
                  </button>
                  <button onClick={() => setEditingCategory(cat)} className="p-1.5 rounded-md hover:bg-accent-soft hover:text-accent transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeletingCategory(cat)} className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span key={skill.id} className="badge inline-flex items-center gap-1.5 pr-2">
                    <button
                      onClick={() => setSkillModal({ categoryId: cat.id, skill })}
                      className="hover:text-white transition-colors"
                    >
                      {skill.name}
                    </button>
                    <button
                      onClick={() => setDeletingSkillId(skill.id)}
                      aria-label={`Delete ${skill.name}`}
                      className="hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={11} />
                    </button>
                  </span>
                ))}
                {cat.skills.length === 0 ? <p className="text-xs text-text-muted">No skills yet in this category.</p> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingCategory ? (
        <AdminFormModal
          title={editingCategory === "new" ? "Add Skill Category" : "Edit Skill Category"}
          fields={categoryFields}
          initialValues={
            editingCategory === "new"
              ? { name: "", displayOrder: 0, active: true }
              : { name: editingCategory.name, displayOrder: editingCategory.displayOrder, active: editingCategory.active }
          }
          onSubmit={handleCategorySubmit}
          onClose={() => setEditingCategory(null)}
        />
      ) : null}

      {deletingCategory ? (
        <ConfirmDialog
          message={`Delete "${deletingCategory.name}" and all its skills? This can't be undone.`}
          onConfirm={async () => {
            await adminApi.deleteSkillCategory(deletingCategory.id);
            setDeletingCategory(null);
            await load();
          }}
          onCancel={() => setDeletingCategory(null)}
        />
      ) : null}

      {skillModal ? (
        <AdminFormModal
          title={skillModal.skill === "new" ? "Add Skill" : "Edit Skill"}
          fields={skillFields}
          initialValues={
            skillModal.skill === "new"
              ? { name: "", iconKey: "", proficiency: null, displayOrder: 0, active: true }
              : {
                  name: skillModal.skill.name,
                  iconKey: skillModal.skill.iconKey ?? "",
                  proficiency: skillModal.skill.proficiency ?? null,
                  displayOrder: skillModal.skill.displayOrder,
                  active: skillModal.skill.active,
                }
          }
          onSubmit={handleSkillSubmit}
          onClose={() => setSkillModal(null)}
        />
      ) : null}

      {deletingSkillId !== null ? (
        <ConfirmDialog
          message="Delete this skill? This can't be undone."
          onConfirm={async () => {
            await adminApi.deleteSkill(deletingSkillId);
            setDeletingSkillId(null);
            await load();
          }}
          onCancel={() => setDeletingSkillId(null)}
        />
      ) : null}
    </div>
  );
}
