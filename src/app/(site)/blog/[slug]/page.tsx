import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calendar, User } from "lucide-react";
import Container from "@/components/ui/Container";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/data/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "مقاله یافت نشد" };
  }

  const isoDate = toIsoDate(post.date);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | ${siteConfig.name}`,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      type: "article",
      ...(isoDate && { publishedTime: isoDate }),
    },
  };
}

// post.date is often a Jalali-formatted string with no reliable Gregorian
// equivalent; only surface it as a real date (OG/JSON-LD) when it parses.
function toIsoDate(value: string): string | null {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const isoDate = toIsoDate(post.date);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    articleBody: post.content,
    keywords: post.tags.join(", "),
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    ...(isoDate && { datePublished: isoDate }),
  };

  return (
    <article className="bg-white dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`h-56 bg-gradient-to-br ${post.gradient} sm:h-72`} />

      <Container className="max-w-3xl py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 dark:text-teal-400"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به وبلاگ
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl dark:text-white">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.author}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-8 text-lg leading-9 text-slate-700 dark:text-slate-300">
          {post.content}
        </p>
      </Container>
    </article>
  );
}
