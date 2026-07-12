"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function PayForm({ authority, returnUrl }: { authority: string; returnUrl: string }) {
  const [trackingNote, setTrackingNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/gateway/payment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authority, tracking_note: trackingNote }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "خطا در ثبت اطلاعات.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت اطلاعات.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
        <p>پرداخت شما ثبت شد و در انتظار بررسی است. پس از تایید، نتیجه به فروشگاه اطلاع داده می‌شود.</p>
        <a
          href={returnUrl}
          className="mt-4 inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white dark:bg-teal-600"
        >
          بازگشت به فروشگاه
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        کد رهگیری واریز (اختیاری)
      </label>
      <input
        type="text"
        value={trackingNote}
        onChange={(e) => setTrackingNote(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
        placeholder="مثلا ۴ رقم آخر کد پیگیری بانک"
      />

      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-70"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        پرداخت را انجام دادم
      </button>
    </form>
  );
}
