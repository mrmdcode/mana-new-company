import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { deleteNewsItem, updateNewsItem } from "@/lib/db";

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/news/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body?.date?.trim() || !body?.title?.trim() || !body?.excerpt?.trim()) {
    return NextResponse.json({ error: "همه فیلدها الزامی است." }, { status: 400 });
  }

  const item = updateNewsItem(Number(id), { date: body.date, title: body.title, excerpt: body.excerpt });
  if (!item) {
    return NextResponse.json({ error: "خبر یافت نشد." }, { status: 404 });
  }

  revalidatePath("/");
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/news/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  deleteNewsItem(Number(id));
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
