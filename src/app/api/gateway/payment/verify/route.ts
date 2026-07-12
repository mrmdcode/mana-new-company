import { NextResponse } from "next/server";
import { getTransactionByAuthority } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const merchantId = body?.merchant_id?.trim();
  const authority = body?.authority?.trim();

  if (!merchantId || !authority) {
    return NextResponse.json({ error: "merchant_id و authority الزامی است." }, { status: 400 });
  }

  const transaction = getTransactionByAuthority(authority);
  if (!transaction || transaction.merchant_id !== merchantId) {
    return NextResponse.json({ error: "تراکنش یافت نشد." }, { status: 404 });
  }

  return NextResponse.json({
    status: transaction.status,
    amount: transaction.amount,
    authority: transaction.authority,
    ref_id: transaction.status === "confirmed" ? transaction.id : null,
  });
}
