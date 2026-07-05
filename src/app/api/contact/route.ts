import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  phone?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactPayload | null;

  if (!body?.name?.trim() || !body?.phone?.trim() || !body?.message?.trim()) {
    return NextResponse.json(
      { error: "نام، شماره تماس و پیام الزامی است." },
      { status: 400 }
    );
  }

  // TODO: اتصال به سرویس ایمیل/پیامک واقعی از طریق متغیرهای محیطی انجام شود.
  console.log("New contact request:", body);

  return NextResponse.json({ success: true });
}
