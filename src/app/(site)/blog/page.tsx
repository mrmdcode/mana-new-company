import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "وبلاگ",
  description:
    "مقالات و راهنماهای شرکت محافظ اسرار نهان آریا درباره اتوماسیون سازمانی، امنیت اطلاعات، سئو و توسعه کسب‌وکار دیجیتال.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `وبلاگ | ${siteConfig.name}`,
    description:
      "مقالات و راهنماهای شرکت محافظ اسرار نهان آریا درباره اتوماسیون سازمانی، امنیت اطلاعات، سئو و توسعه کسب‌وکار دیجیتال.",
    url: `${siteConfig.url}/blog`,
  },
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-100 bg-slate-50 py-16 dark:border-white/5 dark:bg-slate-900/40 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="وبلاگ"
            title="مقالات و راهنماهای تخصصی"
            description="محتوای این بخش از یک سرویس مستقل بلاگ (API جداگانه) دریافت می‌شود و به‌صورت خودکار به‌روزرسانی می‌گردد."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 dark:border-white/5 dark:bg-white/[0.03] dark:hover:shadow-none"
              >
                <div
                  className={`h-36 bg-gradient-to-br ${post.gradient}`}
                  aria-hidden="true"
                />
                <div className="p-6">
                  <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                    {post.date} · {post.author}
                  </p>
                  <h2 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                    {post.title}
                  </h2>
                  <p className="mt-2.5 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/5 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
