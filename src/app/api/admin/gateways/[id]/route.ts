import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { deleteGateway, updateGateway } from "@/lib/db";

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/gateways/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const domainId = Number(body?.domain_id);
  if (!domainId || !body?.card_number?.trim() || !body?.card_holder_name?.trim()) {
    return NextResponse.json({ error: "دامنه، شماره کارت و نام صاحب کارت الزامی است." }, { status: 400 });
  }
  const status = body.status === "inactive" ? "inactive" : "active";

  const item = updateGateway(Number(id), {
    domain_id: domainId,
    card_number: body.card_number,
    card_holder_name: body.card_holder_name,
    status,
  });
  if (!item) {
    return NextResponse.json({ error: "درگاه یافت نشد." }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/gateways/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  deleteGateway(Number(id));
  return NextResponse.json({ success: true });
}
