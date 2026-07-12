import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createDomain, listDomains } from "@/lib/db";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json({ items: listDomains() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  if (!body?.name?.trim() || !body?.domain?.trim()) {
    return NextResponse.json({ error: "نام کسب‌وکار و دامنه الزامی است." }, { status: 400 });
  }

  const item = createDomain({ name: body.name, domain: body.domain });
  return NextResponse.json({ item }, { status: 201 });
}
