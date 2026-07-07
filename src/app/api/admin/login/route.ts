import { NextResponse } from "next/server";
import { getOrCreateAdminPasswordHash } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_TTL_MS, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password ?? "";

  if (!password || !verifyPassword(password, getOrCreateAdminPasswordHash())) {
    return NextResponse.json({ error: "رمز عبور نادرست است." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_MS / 1000,
  });
  return response;
}
