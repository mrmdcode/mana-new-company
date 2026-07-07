import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { deleteMessage } from "@/lib/db";

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/messages/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  deleteMessage(Number(id));
  return NextResponse.json({ success: true });
}
