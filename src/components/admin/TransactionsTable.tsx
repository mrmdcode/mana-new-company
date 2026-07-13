import type { TransactionWithGatewayRow } from "@/lib/db";

const statusLabel: Record<TransactionWithGatewayRow["status"], string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  failed: "ناموفق",
};

const statusClass: Record<TransactionWithGatewayRow["status"], string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  failed: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function TransactionsTable({ initialItems }: { initialItems: TransactionWithGatewayRow[] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
      <table className="w-full min-w-[720px] text-start text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-start font-semibold">کسب‌وکار</th>
            <th className="px-4 py-3 text-start font-semibold">مبلغ (تومان)</th>
            <th className="px-4 py-3 text-start font-semibold">توضیحات</th>
            <th className="px-4 py-3 text-start font-semibold">کد رهگیری زرین‌پال</th>
            <th className="px-4 py-3 text-start font-semibold">وضعیت</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {initialItems.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                هنوز تراکنشی ثبت نشده است.
              </td>
            </tr>
          )}
          {initialItems.map((tx) => (
            <tr key={tx.id} className="bg-white dark:bg-transparent">
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{tx.domain_name}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{tx.amount.toLocaleString("fa-IR")}</td>
              <td className="max-w-xs truncate px-4 py-3 text-slate-700 dark:text-slate-300">{tx.description}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{tx.ref_id || "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[tx.status]}`}>
                  {statusLabel[tx.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
