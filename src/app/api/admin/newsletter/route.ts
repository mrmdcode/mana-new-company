import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { countSubscribers, listSubscribers } from "@/lib/db";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json({ items: listSubscribers(), count: countSubscribers() });
}
