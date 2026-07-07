import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getOrCreateAdminPasswordHash, setSetting } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as
    | { currentPassword?: string; newPassword?: string }
    | null;

  const currentPassword = body?.currentPassword ?? "";
  const newPassword = body?.newPassword ?? "";

  if (!verifyPassword(currentPassword, getOrCreateAdminPasswordHash())) {
    return NextResponse.json({ error: "رمز عبور فعلی نادرست است." }, { status: 401 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد." }, { status: 400 });
  }

  setSetting("admin_password_hash", hashPassword(newPassword));
  return NextResponse.json({ success: true });
}
