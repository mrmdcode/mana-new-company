import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { deletePortfolioItem, updatePortfolioItem } from "@/lib/db";

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/portfolio/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body?.title?.trim() || !body?.category?.trim() || !body?.description?.trim() || !body?.gradient?.trim()) {
    return NextResponse.json({ error: "همه فیلدها الزامی است." }, { status: 400 });
  }

  const item = updatePortfolioItem(Number(id), {
    title: body.title,
    category: body.category,
    description: body.description,
    gradient: body.gradient,
  });

  if (!item) {
    return NextResponse.json({ error: "نمونه‌کار یافت نشد." }, { status: 404 });
  }

  revalidatePath("/");
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/portfolio/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  deletePortfolioItem(Number(id));
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
