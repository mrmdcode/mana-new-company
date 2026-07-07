import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { Calendar } from "lucide-react";
import { listNews } from "@/lib/db";
import NewsletterSubscribeForm from "./NewsletterSubscribeForm";

export default function Newsletter() {
  const news = listNews(10);

  return (
    <section
      id="news"
      className="scroll-mt-24 bg-slate-50 py-24 dark:bg-slate-900/40"
    >
      <Container>
        <SectionHeading
          eyebrow="خبرنامه"
          title="۱۰ خبر اخیر شرکت"
          description="تازه‌ترین رویدادها، همکاری‌ها و به‌روزرسانی‌های محافظ اسرار نهان آریا را دنبال کنید."
        />

        <NewsletterSubscribeForm />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {news.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-200 hover:shadow-md dark:border-white/5 dark:bg-white/[0.03] dark:hover:border-teal-500/30"
            >
              <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-teal-50 px-3 py-2 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
                <Calendar className="h-4 w-4" />
                <span className="mt-1 whitespace-nowrap text-[11px] font-bold">
                  {item.date}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
