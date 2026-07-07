import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createPortfolioItem, listPortfolio } from "@/lib/db";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json({ items: listPortfolio() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  if (!body?.title?.trim() || !body?.category?.trim() || !body?.description?.trim() || !body?.gradient?.trim()) {
    return NextResponse.json({ error: "همه فیلدها الزامی است." }, { status: 400 });
  }

  const item = createPortfolioItem({
    title: body.title,
    category: body.category,
    description: body.description,
    gradient: body.gradient,
  });

  revalidatePath("/");
  return NextResponse.json({ item }, { status: 201 });
}
