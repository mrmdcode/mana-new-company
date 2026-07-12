import { NextResponse } from "next/server";
import { createTransaction, getActiveGatewayByMerchantId } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const merchantId = body?.merchant_id?.trim();
  const amount = Number(body?.amount);
  const callbackUrl = body?.callback_url?.trim();

  if (!merchantId) {
    return NextResponse.json({ error: "merchant_id الزامی است." }, { status: 400 });
  }
  if (!Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json({ error: "amount باید عدد صحیح مثبت باشد." }, { status: 400 });
  }
  if (!callbackUrl || !/^https?:\/\//.test(callbackUrl)) {
    return NextResponse.json({ error: "callback_url معتبر الزامی است." }, { status: 400 });
  }

  const gateway = getActiveGatewayByMerchantId(merchantId);
  if (!gateway) {
    return NextResponse.json({ error: "درگاهی برای این merchant_id یافت نشد یا فعال نیست." }, { status: 404 });
  }

  const transaction = createTransaction({
    gateway_id: gateway.id,
    amount,
    description: typeof body?.description === "string" ? body.description : "",
    mobile: typeof body?.mobile === "string" ? body.mobile : "",
    callback_url: callbackUrl,
  });

  const origin = new URL(request.url).origin;
  return NextResponse.json(
    {
      authority: transaction.authority,
      pay_url: `${origin}/pay/${transaction.authority}`,
    },
    { status: 201 }
  );
}
