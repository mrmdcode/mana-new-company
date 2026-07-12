import { notFound } from "next/navigation";
import PayForm from "@/components/pay/PayForm";
import { getTransactionByAuthority } from "@/lib/db";

const statusLabel = {
  pending: "در انتظار بررسی",
  confirmed: "تایید شده",
  rejected: "رد شده",
} as const;

function buildReturnUrl(callbackUrl: string, authority: string, status: string) {
  try {
    const url = new URL(callbackUrl);
    url.searchParams.set("authority", authority);
    url.searchParams.set("status", status);
    return url.toString();
  } catch {
    return callbackUrl;
  }
}

export default async function PayPage({ params }: { params: Promise<{ authority: string }> }) {
  const { authority } = await params;
  const transaction = getTransactionByAuthority(authority);

  if (!transaction) {
    notFound();
  }

  const returnUrl = buildReturnUrl(transaction.callback_url, transaction.authority, transaction.status);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-sm text-slate-500 dark:text-slate-400">{transaction.domain_name}</p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
          {transaction.amount.toLocaleString("fa-IR")} ریال
        </h1>
        {transaction.description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{transaction.description}</p>
        )}

        <div className="mt-5 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">شماره کارت</span>
            <span dir="ltr" className="font-mono font-semibold text-slate-900 dark:text-white">
              {transaction.card_number}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">صاحب کارت</span>
            <span className="font-semibold text-slate-900 dark:text-white">{transaction.card_holder_name}</span>
          </div>
        </div>

        {transaction.status === "pending" ? (
          <>
            <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
              مبلغ بالا را به شماره کارت فوق واریز کنید، سپس دکمه زیر را بزنید.
            </p>
            <PayForm authority={transaction.authority} returnUrl={returnUrl} />
          </>
        ) : (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-white/10 dark:bg-white/5">
            <p className="font-semibold text-slate-900 dark:text-white">
              وضعیت: {statusLabel[transaction.status]}
            </p>
            <a
              href={returnUrl}
              className="mt-4 inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white dark:bg-teal-600"
            >
              بازگشت به فروشگاه
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
