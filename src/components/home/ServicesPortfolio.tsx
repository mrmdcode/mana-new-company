import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { ExternalLink } from "lucide-react";
import { listPortfolio } from "@/lib/db";

export default function ServicesPortfolio() {
  const portfolio = listPortfolio();

  return (
    <section
      id="portfolio"
      className="scroll-mt-24 bg-white py-24 dark:bg-slate-950"
    >
      <Container>
        <SectionHeading
          eyebrow="نمونه‌کارها"
          title="پروژه‌هایی که با افتخار اجرا کرده‌ایم"
          description="گوشه‌ای از خدماتی که برای کارفرمایان خود در حوزه‌های مختلف پیاده‌سازی کرده‌ایم."
        />

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 dark:border-white/5 dark:bg-white/[0.03] dark:hover:shadow-none"
            >
              <div
                className={`flex h-36 items-center justify-center bg-gradient-to-br ${item.gradient} relative`}
              >
                <span className="text-sm font-semibold text-white/90">
                  {item.category}
                </span>
                <ExternalLink className="absolute left-4 top-4 h-4 w-4 text-white/70 transition group-hover:text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
