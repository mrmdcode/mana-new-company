import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { deletePartner, updatePartner } from "@/lib/db";

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/partners/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body?.name?.trim() || !body?.field?.trim()) {
    return NextResponse.json({ error: "نام و حوزه فعالیت الزامی است." }, { status: 400 });
  }

  const item = updatePartner(Number(id), { name: body.name, field: body.field });
  if (!item) {
    return NextResponse.json({ error: "همکار یافت نشد." }, { status: 404 });
  }

  revalidatePath("/");
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/partners/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  deletePartner(Number(id));
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
