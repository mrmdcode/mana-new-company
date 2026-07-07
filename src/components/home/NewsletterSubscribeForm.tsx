"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function NewsletterSubscribeForm() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "ثبت‌نام ناموفق بود.");

      setStatus("success");
      setMessage("عضویت شما در خبرنامه با موفقیت ثبت شد.");
      setPhone("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "ثبت‌نام ناموفق بود.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="flex-1">
        <label htmlFor="newsletter-phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          عضویت در خبرنامه
        </label>
        <input
          id="newsletter-phone"
          type="tel"
          required
          dir="ltr"
          placeholder="09xxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-70 sm:mt-6"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        عضویت
      </button>
      {message && (
        <p
          className={`sm:basis-full ${
            status === "success" ? "text-teal-700 dark:text-teal-400" : "text-red-600 dark:text-red-400"
          } text-sm`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
