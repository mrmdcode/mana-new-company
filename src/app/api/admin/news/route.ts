import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createNewsItem, listNews } from "@/lib/db";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json({ items: listNews() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  if (!body?.date?.trim() || !body?.title?.trim() || !body?.excerpt?.trim()) {
    return NextResponse.json({ error: "همه فیلدها الزامی است." }, { status: 400 });
  }

  const item = createNewsItem({ date: body.date, title: body.title, excerpt: body.excerpt });
  revalidatePath("/");
  return NextResponse.json({ item }, { status: 201 });
}
