"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "ارسال پیام با خطا مواجه شد.");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "ارسال پیام با خطا مواجه شد."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/5 dark:bg-white/[0.03]"
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        فرم ارسال درخواست
      </h3>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
        در کمتر از یک روز کاری با شما تماس خواهیم گرفت.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            نام و نام خانوادگی
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-teal-500/20"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            شماره تماس
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            dir="ltr"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-teal-500/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            ایمیل (اختیاری)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-teal-500/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            پیام شما
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-teal-500/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        ارسال درخواست
      </button>

      {status === "success" && (
        <p className="mt-4 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
          پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
