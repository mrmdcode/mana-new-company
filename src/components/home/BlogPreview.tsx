import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBlogPosts } from "@/lib/blog";

export default async function BlogPreview() {
  const posts = (await getBlogPosts()).slice(0, 3);

  return (
    <section
      id="blog"
      className="scroll-mt-24 bg-white py-24 dark:bg-slate-950"
    >
      <Container>
        <SectionHeading
          eyebrow="وبلاگ"
          title="آخرین مقالات و راهنماها"
          description="مطالبی درباره اتوماسیون، امنیت اطلاعات، سئو و رشد کسب‌وکار دیجیتال."
        />

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 dark:border-white/5 dark:bg-white/[0.03] dark:hover:shadow-none"
            >
              <div
                className={`h-32 bg-gradient-to-br ${post.gradient}`}
                aria-hidden="true"
              />
              <div className="p-6">
                <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                  {post.date}
                </p>
                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {post.title}
                </h3>
                <p className="mt-2.5 line-clamp-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:text-slate-200"
          >
            مشاهده همه مقالات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
