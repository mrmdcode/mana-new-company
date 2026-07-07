"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

type BaleSettings = {
  baleBotTokenSet: boolean;
  baleBotTokenPreview: string;
  baleChatId: string;
};

export default function SettingsForm({ initialSettings }: { initialSettings: BaleSettings }) {
  const [baleToken, setBaleToken] = useState("");
  const [baleChatId, setBaleChatId] = useState(initialSettings.baleChatId);
  const [tokenPreview, setTokenPreview] = useState(initialSettings.baleBotTokenPreview);
  const [tokenSet, setTokenSet] = useState(initialSettings.baleBotTokenSet);
  const [baleSaving, setBaleSaving] = useState(false);
  const [baleMessage, setBaleMessage] = useState("");
  const [baleError, setBaleError] = useState("");
  const [testing, setTesting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleBaleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBaleSaving(true);
    setBaleError("");
    setBaleMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baleBotToken: baleToken, baleChatId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "ذخیره تنظیمات ناموفق بود.");

      setBaleMessage("تنظیمات ربات بله ذخیره شد.");
      if (baleToken) {
        setTokenSet(true);
        setTokenPreview(`${baleToken.slice(0, 6)}••••${baleToken.slice(-4)}`);
        setBaleToken("");
      }
    } catch (err) {
      setBaleError(err instanceof Error ? err.message : "ذخیره تنظیمات ناموفق بود.");
    } finally {
      setBaleSaving(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setBaleError("");
    setBaleMessage("");
    try {
      const res = await fetch("/api/admin/settings/bale-test", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "ارسال پیام آزمایشی ناموفق بود.");
      setBaleMessage("پیام آزمایشی با موفقیت به بله ارسال شد.");
    } catch (err) {
      setBaleError(err instanceof Error ? err.message : "ارسال پیام آزمایشی ناموفق بود.");
    } finally {
      setTesting(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordError("رمز عبور جدید با تکرار آن یکسان نیست.");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "تغییر رمز عبور ناموفق بود.");

      setPasswordMessage("رمز عبور با موفقیت تغییر کرد.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "تغییر رمز عبور ناموفق بود.");
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        onSubmit={handleBaleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]"
      >
        <h2 className="font-bold text-slate-900 dark:text-white">اتصال به ربات بله</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          با ثبت توکن ربات بله و شناسه چت، پیام‌های ارسالی از فرم «تماس با ما» به‌صورت خودکار برای شما در بله ارسال می‌شود.
        </p>

        <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          توکن ربات بله
        </label>
        <input
          type="text"
          dir="ltr"
          value={baleToken}
          onChange={(e) => setBaleToken(e.target.value)}
          placeholder={tokenSet ? tokenPreview : "مثال: 123456:AbCdEfGhIjKlMnOpQrSt"}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
        {tokenSet && (
          <p className="mt-1 text-xs text-slate-400">
            توکن فعلی ذخیره شده است. برای تغییر، توکن جدید را وارد کنید.
          </p>
        )}

        <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
          شناسه چت (Chat ID) مقصد
        </label>
        <input
          type="text"
          dir="ltr"
          value={baleChatId}
          onChange={(e) => setBaleChatId(e.target.value)}
          placeholder="مثال: 123456789"
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />

        {baleError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{baleError}</p>}
        {baleMessage && <p className="mt-3 text-sm text-teal-700 dark:text-teal-400">{baleMessage}</p>}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={baleSaving}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-70 dark:bg-teal-600"
          >
            {baleSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            ذخیره تنظیمات
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 disabled:opacity-70 dark:border-white/10 dark:text-slate-200"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            ارسال پیام آزمایشی
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]"
      >
        <h2 className="font-bold text-slate-900 dark:text-white">تغییر رمز عبور پنل مدیریت</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          برای امنیت بیشتر، رمز عبور پیش‌فرض را در اولین ورود تغییر دهید.
        </p>

        <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          رمز عبور فعلی
        </label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
          رمز عبور جدید
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
          تکرار رمز عبور جدید
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />

        {passwordError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{passwordError}</p>}
        {passwordMessage && (
          <p className="mt-3 text-sm text-teal-700 dark:text-teal-400">{passwordMessage}</p>
        )}

        <button
          type="submit"
          disabled={passwordSaving}
          className="mt-5 flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-70 dark:bg-teal-600"
        >
          {passwordSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          تغییر رمز عبور
        </button>
      </form>
    </div>
  );
}
