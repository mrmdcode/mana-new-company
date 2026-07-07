"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

type SmsSettings = {
  apiKeySet: boolean;
  apiKeyPreview: string;
  apiKeySource: "settings" | "env" | "none";
  sender: string;
  contactTemplate: string;
  newsletterTemplate: string;
};

export default function SmsSettingsForm({ initialSettings }: { initialSettings: SmsSettings }) {
  const [apiKey, setApiKey] = useState("");
  const [keyPreview, setKeyPreview] = useState(initialSettings.apiKeyPreview);
  const [keySet, setKeySet] = useState(initialSettings.apiKeySet);
  const [keySource, setKeySource] = useState(initialSettings.apiKeySource);
  const [sender, setSender] = useState(initialSettings.sender);
  const [contactTemplate, setContactTemplate] = useState(initialSettings.contactTemplate);
  const [newsletterTemplate, setNewsletterTemplate] = useState(initialSettings.newsletterTemplate);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [testPhone, setTestPhone] = useState("");
  const [testing, setTesting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/sms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, sender, contactTemplate, newsletterTemplate }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "ذخیره تنظیمات ناموفق بود.");

      setMessage("تنظیمات پیامک ذخیره شد.");
      if (apiKey) {
        setKeySet(true);
        setKeySource("settings");
        setKeyPreview(`${apiKey.slice(0, 4)}••••${apiKey.slice(-4)}`);
        setApiKey("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره تنظیمات ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!testPhone.trim()) {
      setError("برای تست، شماره موبایل را وارد کنید.");
      return;
    }
    setTesting(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings/sms-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: testPhone }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "ارسال پیامک آزمایشی ناموفق بود.");
      setMessage("پیامک آزمایشی ارسال شد.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال پیامک آزمایشی ناموفق بود.");
    } finally {
      setTesting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <h2 className="font-bold text-slate-900 dark:text-white">پیامک خودکار (کاوه‌نگار)</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
        با ثبت کلید API کاوه‌نگار، به هر کسی که فرم «تماس با ما» را ارسال کند یا در خبرنامه عضو شود،
        پیامک تشکر خودکار ارسال می‌شود.
      </p>

      <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        کلید API کاوه‌نگار
      </label>
      <input
        type="text"
        dir="ltr"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder={keySet ? keyPreview : "کلید API را از پنل کاوه‌نگار کپی کنید"}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
      {keySet && (
        <p className="mt-1 text-xs text-slate-400">
          {keySource === "env"
            ? "کلید فعلی از متغیر محیطی سرور (KAVENEGAR_API_KEY) خوانده شده است. برای تغییر، کلید جدید را همین‌جا وارد کنید تا در پنل ذخیره شود."
            : "کلید فعلی ذخیره شده است. برای تغییر، کلید جدید را وارد کنید."}
        </p>
      )}

      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
        شماره خط ارسال‌کننده (اختیاری)
      </label>
      <input
        type="text"
        dir="ltr"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
        placeholder="مثال: 9982003490"
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
      <p className="mt-1 text-xs text-slate-400">
        اگر خالی بماند، از خط پیش‌فرض حساب کاوه‌نگار شما استفاده می‌شود.
      </p>

      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
        متن پیامک برای فرم تماس با ما
      </label>
      <textarea
        rows={2}
        value={contactTemplate}
        onChange={(e) => setContactTemplate(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
      <p className="mt-1 text-xs text-slate-400">
        از <code dir="ltr">{"{name}"}</code> برای درج نام فرستنده در متن استفاده کنید.
      </p>

      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
        متن پیامک برای عضویت در خبرنامه
      </label>
      <textarea
        rows={2}
        value={newsletterTemplate}
        onChange={(e) => setNewsletterTemplate(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />

      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {message && <p className="mt-3 text-sm text-teal-700 dark:text-teal-400">{message}</p>}

      <div className="mt-5 flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-70 dark:bg-teal-600"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          ذخیره تنظیمات
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5 dark:border-white/5">
        <input
          type="tel"
          dir="ltr"
          value={testPhone}
          onChange={(e) => setTestPhone(e.target.value)}
          placeholder="09xxxxxxxxx"
          className="w-44 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
        <button
          type="button"
          onClick={handleTest}
          disabled={testing}
          className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-70 dark:border-white/10 dark:text-slate-200"
        >
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          ارسال پیامک آزمایشی
        </button>
      </div>
    </form>
  );
}
