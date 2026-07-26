import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTransactionByAuthority, getZarinpalConfig } from "@/lib/db";
import { zarinpalStartPayUrl } from "@/lib/zarinpal";

// Per-transaction page: no SEO value, must never be indexed or cached.
export const metadata: Metadata = {
  title: "وضعیت پرداخت",
  robots: { index: false, follow: false },
};

const statusLabel = {
  paid: "پرداخت با موفقیت انجام شد",
  failed: "پرداخت ناموفق بود یا لغو شد",
} as const;

function buildReturnUrl(callbackUrl: string, authority: string, status: string, refId: string | null) {
  try {
    const url = new URL(callbackUrl);
    url.searchParams.set("authority", authority);
    url.searchParams.set("status", status);
    if (refId) url.searchParams.set("ref_id", refId);
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

  if (transaction.status === "pending") {
    const { sandbox } = getZarinpalConfig();
    redirect(zarinpalStartPayUrl(sandbox, authority));
  }

  const returnUrl = buildReturnUrl(transaction.callback_url, transaction.authority, transaction.status, transaction.ref_id);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-sm text-slate-500 dark:text-slate-400">{transaction.domain_name}</p>
        <h1 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
          {statusLabel[transaction.status]}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {transaction.amount.toLocaleString("fa-IR")} تومان
        </p>

        <a
          href={returnUrl}
          className="mt-6 inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white dark:bg-teal-600"
        >
          بازگشت به فروشگاه
        </a>
      </div>
    </main>
  );
}
