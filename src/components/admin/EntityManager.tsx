"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

export type EntityField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: { value: string; label: string }[];
};

export type EntityColumn<T> = {
  key: keyof T;
  label: string;
};

type BaseEntity = { id: number };

export default function EntityManager<T extends BaseEntity>({
  apiBase,
  fields,
  columns,
  initialItems,
  addLabel,
  emptyLabel,
}: {
  apiBase: string;
  fields: EntityField[];
  columns: EntityColumn<T>[];
  initialItems: T[];
  addLabel: string;
  emptyLabel: string;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  function openCreateForm() {
    const initial: Record<string, string> = {};
    for (const field of fields) {
      initial[field.name] = field.options?.[0]?.value ?? "";
    }
    setValues(initial);
    setEditingId(null);
    setError("");
    setFormOpen(true);
  }

  function openEditForm(item: T) {
    const initial: Record<string, string> = {};
    for (const field of fields) {
      initial[field.name] = String((item as Record<string, unknown>)[field.name] ?? "");
    }
    setValues(initial);
    setEditingId(item.id);
    setError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(editingId ? `${apiBase}/${editingId}` : apiBase, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "خطا در ذخیره اطلاعات.");

      if (editingId) {
        setItems((prev) => prev.map((it) => (it.id === editingId ? body.item : it)));
      } else {
        setItems((prev) => [...prev, body.item]);
      }
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره اطلاعات.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("آیا از حذف این مورد مطمئن هستید؟")) return;
    setDeletingId(id);
    try {
      await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((it) => it.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {items.length} مورد ثبت‌شده
        </p>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {editingId ? "ویرایش مورد" : "افزودن مورد جدید"}
            </h3>
            <button type="button" onClick={closeForm} aria-label="بستن">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    required
                    rows={3}
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                ) : field.type === "select" ? (
                  <select
                    required
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    type="text"
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>

          {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-70 dark:bg-teal-600"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              ذخیره
            </button>
            <button type="button" onClick={closeForm} className="text-sm text-slate-500 dark:text-slate-400">
              انصراف
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
        <table className="w-full min-w-[520px] text-start text-sm">
          <thead className="bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-3 text-start font-semibold">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-start font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {items.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-400">
                  {emptyLabel}
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="bg-white dark:bg-transparent">
                {columns.map((col) => (
                  <td key={String(col.key)} className="max-w-xs truncate px-4 py-3 text-slate-700 dark:text-slate-300">
                    {String((item as Record<string, unknown>)[col.key as string] ?? "")}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      aria-label="ویرایش"
                      className="text-slate-500 hover:text-teal-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      aria-label="حذف"
                      className="text-slate-500 hover:text-red-600 disabled:opacity-50"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
