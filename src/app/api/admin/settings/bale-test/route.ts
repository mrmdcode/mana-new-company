import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getSetting } from "@/lib/db";
import { sendBaleMessage } from "@/lib/bale";

export async function POST() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const token = getSetting("bale_bot_token");
  const chatId = getSetting("bale_chat_id");

  if (!token || !chatId) {
    return NextResponse.json(
      { error: "ابتدا توکن ربات بله و شناسه چت را ذخیره کنید." },
      { status: 400 }
    );
  }

  try {
    await sendBaleMessage(token, chatId, "این یک پیام آزمایشی از پنل مدیریت سایت است ✅");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ارسال پیام آزمایشی به بله ناموفق بود:", error);
    return NextResponse.json(
      { error: "ارسال پیام ناموفق بود. توکن ربات، شناسه چت و اتصال اینترنت سرور را بررسی کنید." },
      { status: 502 }
    );
  }
}
