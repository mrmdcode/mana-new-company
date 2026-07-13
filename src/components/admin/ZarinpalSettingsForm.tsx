"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type ZarinpalSettings = {
  merchantIdSet: boolean;
  merchantIdPreview: string;
  sandbox: boolean;
};

export default function ZarinpalSettingsForm({ initialSettings }: { initialSettings: ZarinpalSettings }) {
  const [merchantId, setMerchantId] = useState("");
  const [merchantIdSet, setMerchantIdSet] = useState(initialSettings.merchantIdSet);
  const [merchantIdPreview, setMerchantIdPreview] = useState(initialSettings.merchantIdPreview);
  const [sandbox, setSandbox] = useState(initialSettings.sandbox);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/zarinpal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId, sandbox }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "ذخیره تنظیمات ناموفق بود.");

      setMessage("تنظیمات زرین‌پال ذخیره شد.");
      if (merchantId) {
        setMerchantIdSet(true);
        setMerchantIdPreview(`${merchantId.slice(0, 6)}••••${merchantId.slice(-4)}`);
        setMerchantId("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره تنظیمات ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <h2 className="font-bold text-slate-900 dark:text-white">درگاه پرداخت زرین‌پال</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
        merchant_id حساب زرین‌پال خودتان. تمام دامنه‌هایی که برایشان درگاه فعال می‌کنید، از همین حساب
        برای پرداخت واقعی استفاده می‌کنند.
      </p>

      <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        merchant_id زرین‌پال
      </label>
      <input
        type="text"
        dir="ltr"
        value={merchantId}
        onChange={(e) => setMerchantId(e.target.value)}
        placeholder={merchantIdSet ? merchantIdPreview : "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
      {merchantIdSet && (
        <p className="mt-1 text-xs text-slate-400">
          merchant_id فعلی ذخیره شده است. برای تغییر، مقدار جدید را وارد کنید.
        </p>
      )}

      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={sandbox}
          onChange={(e) => setSandbox(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
        />
        حالت آزمایشی (Sandbox) — بدون پول واقعی
      </label>
      <p className="mt-1 text-xs text-slate-400">
        تا وقتی این گزینه فعال است، پرداخت‌ها روی sandbox.zarinpal.com انجام می‌شوند و پول واقعی جابه‌جا
        نمی‌شود. برای پرداخت واقعی، این گزینه را غیرفعال کنید.
      </p>

      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {message && <p className="mt-3 text-sm text-teal-700 dark:text-teal-400">{message}</p>}

      <div className="mt-5">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-70 dark:bg-teal-600"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          ذخیره تنظیمات
        </button>
      </div>
    </form>
  );
}
