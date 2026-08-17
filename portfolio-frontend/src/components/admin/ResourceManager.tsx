"use client";

import { useEffect, useState } from "react";
import AdminTable, { AdminColumn } from "./AdminTable";
import AdminFormModal, { FieldConfig, FormValues } from "./AdminFormModal";
import ConfirmDialog from "./ConfirmDialog";
import { Plus, Loader2 } from "lucide-react";

export default function ResourceManager<T extends { id: number }>({
  title,
  description,
  fields,
  columns,
  listFn,
  createFn,
  updateFn,
  deleteFn,
  toFormValues,
  emptyValues,
}: {
  title: string;
  description?: string;
  fields: FieldConfig[];
  columns: AdminColumn<T>[];
  listFn: () => Promise<T[]>;
  createFn: (data: unknown) => Promise<unknown>;
  updateFn: (id: number, data: unknown) => Promise<unknown>;
  deleteFn: (id: number) => Promise<unknown>;
  toFormValues: (row: T) => FormValues;
  emptyValues: FormValues;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null | "new">(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  async function load() {
    setLoading(true);
    const data = await listFn();
    setRows(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(values: FormValues) {
    if (editing === "new") {
      await createFn(values);
    } else if (editing) {
      await updateFn(editing.id, values);
    }
    await load();
  }

  async function handleDelete() {
    if (!deleting) return;
    await deleteFn(deleting.id);
    setDeleting(null);
    await load();
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">{title}</h1>
          {description ? <p className="text-text-muted text-sm">{description}</p> : null}
        </div>
        <button onClick={() => setEditing("new")} className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> Add New
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : (
        <AdminTable columns={columns} rows={rows} onEdit={(row) => setEditing(row)} onDelete={(row) => setDeleting(row)} />
      )}

      {editing ? (
        <AdminFormModal
          title={editing === "new" ? `Add ${title.replace(/s$/, "")}` : `Edit ${title.replace(/s$/, "")}`}
          fields={fields}
          initialValues={editing === "new" ? emptyValues : toFormValues(editing)}
          onSubmit={handleSubmit}
          onClose={() => setEditing(null)}
        />
      ) : null}

      {deleting ? (
        <ConfirmDialog
          message="Delete this item? This can't be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      ) : null}
    </div>
  );
}
