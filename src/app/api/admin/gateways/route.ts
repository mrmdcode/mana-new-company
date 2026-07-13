import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createGateway, listGateways } from "@/lib/db";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json({ items: listGateways() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const domainId = Number(body?.domain_id);
  if (!domainId) {
    return NextResponse.json({ error: "انتخاب دامنه الزامی است." }, { status: 400 });
  }

  const item = createGateway({ domain_id: domainId });
  return NextResponse.json({ item }, { status: 201 });
}
