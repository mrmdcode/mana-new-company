import { NextResponse } from "next/server";
import { createMessage, getSetting, markMessageForwarded } from "@/lib/db";
import { sendBaleMessage } from "@/lib/bale";

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
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

  const record = createMessage({
    name: body.name,
    phone: body.phone,
    email: body.email?.trim() ?? "",
    message: body.message,
  });

  const token = getSetting("bale_bot_token");
  const chatId = getSetting("bale_chat_id");

  if (token && chatId) {
    const text = [
      "پیام جدید از فرم تماس سایت",
      "",
      `نام: ${record.name}`,
      `تلفن: ${record.phone}`,
      `ایمیل: ${record.email || "-"}`,
      "",
      "پیام:",
      record.message,
    ].join("\n");

    try {
      await sendBaleMessage(token, chatId, text);
      markMessageForwarded(record.id);
    } catch (error) {
      console.error("ارسال پیام به بله ناموفق بود:", error);
    }
  }

  return NextResponse.json({ success: true });
}
