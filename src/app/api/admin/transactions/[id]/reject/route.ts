import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { decideTransaction } from "@/lib/db";
import { fireCallbackWebhook } from "@/lib/webhook";

export async function POST(_request: Request, ctx: RouteContext<"/api/admin/transactions/[id]/reject">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  const item = decideTransaction(Number(id), "rejected");
  if (!item) {
    return NextResponse.json({ error: "تراکنش یافت نشد یا قبلا نهایی شده است." }, { status: 404 });
  }

  fireCallbackWebhook(item.callback_url, {
    authority: item.authority,
    status: "rejected",
    amount: item.amount,
    ref_id: null,
  });

  return NextResponse.json({ item });
}
