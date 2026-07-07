import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { deleteSubscriber } from "@/lib/db";

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/newsletter/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  deleteSubscriber(Number(id));
  return NextResponse.json({ success: true });
}
