import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getSetting, setSetting } from "@/lib/db";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const token = getSetting("bale_bot_token") ?? "";
  return NextResponse.json({
    baleBotTokenSet: token.length > 0,
    baleBotTokenPreview: token ? `${token.slice(0, 6)}••••${token.slice(-4)}` : "",
    baleChatId: getSetting("bale_chat_id") ?? "",
  });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as
    | { baleBotToken?: string; baleChatId?: string }
    | null;

  if (typeof body?.baleBotToken === "string" && body.baleBotToken.trim()) {
    setSetting("bale_bot_token", body.baleBotToken.trim());
  }
  if (typeof body?.baleChatId === "string") {
    setSetting("bale_chat_id", body.baleChatId.trim());
  }

  return NextResponse.json({ success: true });
}
