import { NextResponse } from "next/server";
import { createSubscriber } from "@/lib/db";

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

  return NextResponse.json({ success: true }, { status: 201 });
}
