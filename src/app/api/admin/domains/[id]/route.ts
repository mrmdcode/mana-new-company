import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { deleteDomain, updateDomain } from "@/lib/db";

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/domains/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body?.name?.trim() || !body?.domain?.trim()) {
    return NextResponse.json({ error: "نام کسب‌وکار و دامنه الزامی است." }, { status: 400 });
  }
  const status = body.status === "inactive" ? "inactive" : "active";

  const item = updateDomain(Number(id), { name: body.name, domain: body.domain, status });
  if (!item) {
    return NextResponse.json({ error: "دامنه یافت نشد." }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/domains/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  deleteDomain(Number(id));
  return NextResponse.json({ success: true });
}
