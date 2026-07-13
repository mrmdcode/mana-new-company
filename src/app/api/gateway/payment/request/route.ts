import { NextResponse } from "next/server";
import { createTransaction, getActiveGatewayByMerchantId, getZarinpalConfig } from "@/lib/db";
import { zarinpalRequestPayment } from "@/lib/zarinpal";
import { siteConfig } from "@/data/site";

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

  const zarinpal = getZarinpalConfig();
  if (!zarinpal.merchantId) {
    return NextResponse.json({ error: "درگاه زرین‌پال هنوز در تنظیمات پنل مدیریت پیکربندی نشده است." }, { status: 500 });
  }

  const description = typeof body?.description === "string" ? body.description : "پرداخت";
  const mobile = typeof body?.mobile === "string" ? body.mobile : undefined;

  let zarinpalResult;
  try {
    zarinpalResult = await zarinpalRequestPayment({
      merchantId: zarinpal.merchantId,
      sandbox: zarinpal.sandbox,
      amount,
      description,
      mobile,
      callbackUrl: `${siteConfig.url}/api/gateway/payment/zarinpal-callback`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "اتصال به زرین‌پال ناموفق بود." },
      { status: 502 }
    );
  }

  createTransaction({
    gateway_id: gateway.id,
    authority: zarinpalResult.authority,
    amount,
    description,
    mobile: mobile ?? "",
    callback_url: callbackUrl,
  });

  return NextResponse.json(
    {
      authority: zarinpalResult.authority,
      pay_url: `${siteConfig.url}/pay/${zarinpalResult.authority}`,
    },
    { status: 201 }
  );
}
