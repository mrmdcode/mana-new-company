import { NextResponse } from "next/server";
import { createSubscriber, getKavenegarConfig, getSetting } from "@/lib/db";
import { sendSms } from "@/lib/kavenegar";
import { DEFAULT_NEWSLETTER_SMS_TEMPLATE } from "@/data/sms-templates";

const PHONE_PATTERN = /^0?9\d{9}$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { phone?: string } | null;
  const phone = body?.phone?.trim().replace(/\s|-/g, "") ?? "";

  if (!PHONE_PATTERN.test(phone)) {
    return NextResponse.json({ error: "شماره موبایل معتبر نیست." }, { status: 400 });
  }

  const normalized = phone.startsWith("0") ? phone : `0${phone}`;
  const result = createSubscriber(normalized);

  if (!result.ok) {
    return NextResponse.json({ error: "این شماره قبلاً در خبرنامه عضو شده است." }, { status: 409 });
  }

  const { apiKey: kavenegarKey, sender } = getKavenegarConfig();
  if (kavenegarKey) {
    const template = getSetting("sms_newsletter_template") || DEFAULT_NEWSLETTER_SMS_TEMPLATE;
    try {
      await sendSms(kavenegarKey, normalized, template, sender);
    } catch (error) {
      console.error("ارسال پیامک خوش‌آمدگویی خبرنامه ناموفق بود:", error);
    }
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
