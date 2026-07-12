"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { TransactionWithGatewayRow } from "@/lib/db";

const statusLabel: Record<TransactionWithGatewayRow["status"], string> = {
  pending: "در انتظار بررسی",
  confirmed: "تایید شده",
  rejected: "رد شده",
};

const statusClass: Record<TransactionWithGatewayRow["status"], string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  confirmed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  rejected: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function TransactionsTable({ initialItems }: { initialItems: TransactionWithGatewayRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function decide(id: number, action: "confirm" | "reject") {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/transactions/${id}/${action}`, { method: "POST" });
      const body = await res.json();
      if (res.ok && body.item) {
        setItems((prev) => prev.map((it) => (it.id === id ? body.item : it)));
      }
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
      <table className="w-full min-w-[720px] text-start text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-start font-semibold">کسب‌وکار</th>
            <th className="px-4 py-3 text-start font-semibold">مبلغ (ریال)</th>
            <th className="px-4 py-3 text-start font-semibold">توضیحات</th>
            <th className="px-4 py-3 text-start font-semibold">کد رهگیری واریز</th>
            <th className="px-4 py-3 text-start font-semibold">وضعیت</th>
            <th className="px-4 py-3 text-start font-semibold">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                هنوز تراکنشی ثبت نشده است.
              </td>
            </tr>
          )}
          {items.map((tx) => (
            <tr key={tx.id} className="bg-white dark:bg-transparent">
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{tx.domain_name}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{tx.amount.toLocaleString("fa-IR")}</td>
              <td className="max-w-xs truncate px-4 py-3 text-slate-700 dark:text-slate-300">{tx.description}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{tx.tracking_note || "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[tx.status]}`}>
                  {statusLabel[tx.status]}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {tx.status === "pending" ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decide(tx.id, "confirm")}
                      disabled={pendingId === tx.id}
                      className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {pendingId === tx.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      تایید پرداخت
                    </button>
                    <button
                      type="button"
                      onClick={() => decide(tx.id, "reject")}
                      disabled={pendingId === tx.id}
                      className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-60 dark:bg-red-500/10 dark:text-red-400"
                    >
                      رد
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
