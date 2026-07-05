import { NextResponse } from "next/server";
import { getBlogPost } from "@/lib/blog";

export async function GET(_req: Request, ctx: RouteContext<"/api/blog/[slug]">) {
  const { slug } = await ctx.params;
  const post = await getBlogPost(slug);
  if (!post) {
    return NextResponse.json({ error: "پست یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ post });
}
