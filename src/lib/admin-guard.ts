import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "./auth";

export async function requireAdmin(): Promise<NextResponse | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "ابتدا وارد پنل مدیریت شوید." }, { status: 401 });
  }

  return null;
}
