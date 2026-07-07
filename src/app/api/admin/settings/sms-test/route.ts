import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getKavenegarConfig } from "@/lib/db";
import { sendSms } from "@/lib/kavenegar";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { apiKey, sender } = getKavenegarConfig();
  if (!apiKey) {
    return NextResponse.json(
      { error: "ابتدا کلید API کاوه‌نگار را ذخیره کنید یا KAVENEGAR_API_KEY را در env تنظیم کنید." },
      { status: 400 }
    );
  }

  const body = (await request.json().catch(() => null)) as { phone?: string } | null;
  const phone = body?.phone?.trim();
  if (!phone) {
    return NextResponse.json({ error: "شماره موبایل برای تست الزامی است." }, { status: 400 });
  }

  try {
    await sendSms(apiKey, phone, "این یک پیامک آزمایشی از پنل مدیریت سایت است.", sender);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ارسال پیامک آزمایشی ناموفق بود:", error);
    return NextResponse.json(
      { error: "ارسال پیامک ناموفق بود. کلید API و شماره موبایل را بررسی کنید." },
      { status: 502 }
    );
  }
}
