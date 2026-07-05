import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles, Store, Workflow } from "lucide-react";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

const stats = [
  { value: "+۱۰", label: "سال تجربه اجرایی" },
  { value: "+۸۰", label: "پروژه تحویل‌شده" },
  { value: "۲۴/۷", label: "پشتیبانی فنی" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-slate-950 pb-24 pt-14 sm:pb-32 sm:pt-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(13,148,136,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.25),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(13,148,136,0.2),transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:44px_44px]"
      />

      <Container className="relative grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium text-teal-300 ring-1 ring-white/10">
            <Sparkles className="h-4 w-4" />
            همراه امن مسیر دیجیتال کسب‌وکار شما
          </span>

          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-l from-teal-300 via-cyan-300 to-teal-500 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-8 text-slate-300 lg:mx-0">
            {siteConfig.tagline}؛ از اتوماسیون فرآیندهای سازمانی و طراحی سایت‌های شرکتی و
            فروشگاهی گرفته تا صحت‌سنجی کد ملی و ارائه خدمات اشتراکی نرم‌افزاری —
            کنار شما هستیم تا امن، سریع و مطمئن رشد کنید.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/contact"
              className="w-full rounded-full bg-teal-500 px-7 py-3.5 text-center text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/30 transition hover:bg-teal-400 sm:w-auto"
            >
              درخواست مشاوره رایگان
            </Link>
            <Link
              href="/#services"
              className="flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/5 sm:w-auto"
            >
              مشاهده خدمات
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-start">
                <p className="text-2xl font-extrabold text-white sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden h-[26rem] w-full max-w-md [perspective:1400px] lg:block">
          <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
            <div className="h-64 w-64 rotate-[18deg] rounded-[2.5rem] bg-gradient-to-br from-teal-400/90 to-cyan-600/90 shadow-2xl shadow-teal-500/30 [transform:rotateY(-18deg)_rotateX(10deg)]" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck
              className="h-28 w-28 text-white drop-shadow-[0_10px_25px_rgba(13,148,136,0.6)]"
              strokeWidth={1.5}
            />
          </div>

          <div className="animate-float-slow absolute right-2 top-6 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur">
            <Workflow className="h-5 w-5 text-teal-300" />
            اتوماسیون هوشمند
          </div>

          <div className="animate-float-slower absolute bottom-10 left-0 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur">
            <Store className="h-5 w-5 text-cyan-300" />
            فروشگاه اینترنتی
          </div>

          <div className="animate-float-slow absolute bottom-32 right-0 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur [animation-delay:1.2s]">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            صحت‌سنجی کد ملی
          </div>
        </div>
      </Container>

      <Container className="relative mt-16">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white/5 px-6 py-5 text-center ring-1 ring-white/10 sm:flex-row sm:text-start">
          <p className="text-sm font-medium text-slate-200 sm:text-base">
            آماده مشارکت در فعالیت‌های اشتغال‌زا و کسب‌وکارهای نوپا و جدید هستیم.
          </p>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-teal-300"
          >
            با ما همکاری کنید
          </Link>
        </div>
      </Container>
    </section>
  );
}
