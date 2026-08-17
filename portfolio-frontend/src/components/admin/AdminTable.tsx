"use client";

import { Pencil, Trash2 } from "lucide-react";

export interface AdminColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export default function AdminTable<T extends { id: number }>({
  columns,
  rows,
  onEdit,
  onDelete,
}: {
  columns: AdminColumn<T>[];
  rows: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
}) {
  if (rows.length === 0) {
    return <div className="card p-8 text-center text-text-muted text-sm">No items yet. Click &quot;Add New&quot; to create one.</div>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold text-text-muted whitespace-nowrap">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0 hover:bg-bg-soft transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-top">
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button
                  onClick={() => onEdit(row)}
                  aria-label="Edit"
                  className="p-1.5 rounded-md hover:bg-accent-soft hover:text-accent transition-colors mr-1"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => onDelete(row)}
                  aria-label="Delete"
                  className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
