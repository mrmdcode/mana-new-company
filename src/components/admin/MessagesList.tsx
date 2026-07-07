"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Trash2 } from "lucide-react";
import type { ContactMessageRow } from "@/lib/db";

export default function MessagesList({ initialItems }: { initialItems: ContactMessageRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!window.confirm("این پیام حذف شود؟")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((it) => it.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400 dark:border-white/10 dark:bg-white/[0.03]">
        هنوز پیامی از فرم تماس با ما ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400" dir="ltr">
                {item.phone}
                {item.email && ` · ${item.email}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {item.forwarded_to_bale ? (
                <span className="flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  ارسال‌شده به بله
                </span>
              ) : null}
              <span className="text-xs text-slate-400">{item.created_at}</span>
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
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-300">
            {item.message}
          </p>
        </div>
      ))}
    </div>
  );
}
