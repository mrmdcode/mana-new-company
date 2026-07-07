"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";

const MAX_FILE_SIZE = 500 * 1024;

export default function LogoUploadForm({ initialLogo }: { initialLogo: string | null }) {
  const [logo, setLogo] = useState(initialLogo);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setMessage("");

    if (file.size > MAX_FILE_SIZE) {
      setError("حجم فایل باید کمتر از ۵۰۰ کیلوبایت باشد.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploading(true);
      try {
        const res = await fetch("/api/admin/settings/logo", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logo: dataUrl }),
        });
        const responseBody = await res.json();
        if (!res.ok) throw new Error(responseBody.error ?? "بارگذاری لوگو ناموفق بود.");

        setLogo(dataUrl);
        setMessage("لوگو با موفقیت به‌روزرسانی شد.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "بارگذاری لوگو ناموفق بود.");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleRemove() {
    if (!window.confirm("لوگو حذف شود و آیکون پیش‌فرض نمایش داده شود؟")) return;
    setRemoving(true);
    setError("");
    setMessage("");
    try {
      await fetch("/api/admin/settings/logo", { method: "DELETE" });
      setLogo(null);
      setMessage("لوگو حذف شد.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
      <h2 className="font-bold text-slate-900 dark:text-white">لوگوی سایت</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
        تصویری با فرمت PNG، JPG، WEBP یا SVG و حجم کمتر از ۵۰۰ کیلوبایت آپلود کنید. این لوگو در هدر و
        فوتر سایت جایگزین آیکون پیش‌فرض می‌شود.
      </p>

      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL preview, not an optimizable asset
            <img src={logo} alt="لوگوی سایت" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-[11px] text-slate-400">بدون لوگو</span>
          )}
        </div>

        <div className="flex flex-col items-start gap-2.5">
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {logo ? "تغییر لوگو" : "بارگذاری لوگو"}
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {logo && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="flex items-center gap-1.5 text-sm text-red-600 disabled:opacity-50 dark:text-red-400"
            >
              {removing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              حذف لوگو
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {message && <p className="mt-3 text-sm text-teal-700 dark:text-teal-400">{message}</p>}
    </div>
  );
}
