"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import type { SubscriberRow } from "@/lib/db";

export default function SubscribersTable({ initialItems }: { initialItems: SubscriberRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!window.confirm("این مشترک حذف شود؟")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((it) => it.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
      <table className="w-full min-w-[420px] text-start text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-start font-semibold">شماره موبایل</th>
            <th className="px-4 py-3 text-start font-semibold">تاریخ عضویت</th>
            <th className="px-4 py-3 text-start font-semibold">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {items.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                هنوز مشترکی ثبت نشده است.
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300" dir="ltr">
                {item.phone}
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.created_at}</td>
              <td className="px-4 py-3">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
